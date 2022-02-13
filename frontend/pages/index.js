import React, { useState, useEffect, memo} from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Container,
  Icon,
  Checkbox,
  FormControlLabel,
  IconButton,
  CircularProgress
} from '@mui/material';

import { initializeApollo } from '../apollo/client'
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag'

const GetTodosQuery = gql`
  query TodosQuery{
    todos {
      data{
        id,
        attributes{
          message
        }
      },
      meta {
        pagination {
          page,
          pageSize,
          pageCount,
          total
        }
      }
    }
  }
`

const CreateTodoMutation = gql`
  mutation CreateTodo($message: String!) {
    createTodo(data:{message: $message}){
      data{
        id,
        attributes{
          message
        }
      }
    }
  }
`

const DeleteTodoMutation = gql`
  mutation DeleteTodo($id: ID!){
    deleteTodo(id: $id){
      data{
        id
      }
    }
  }
`

const UpdateTodoMutation = gql`
  mutation UpdateTodo($id: ID!,$message: String!) {
    updateTodo(id: $id ,data:{message: $message}){
      data{
        id,
        attributes{
          message
        }
      }
    }
  }
`

const TodoItem = memo((props) => {
  const { value, id } = props;
  const [isDone,setIsDone] = useState(false);
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState(value);

  const [deleteTodo, {loading: deleteTodoLoading, error: deleteTodoError }] = useMutation(DeleteTodoMutation, {
    refetchQueries: [
      GetTodosQuery
    ]
  });

  const [updateTodo, {loading: updateTodoLoading, error: updateTodoError }] = useMutation(UpdateTodoMutation, {
    refetchQueries: [
      GetTodosQuery
    ]
  });

  useEffect(() => {
    if(isEdit && !updateTodoLoading) {
      setIsEdit(false)
    }
  }, [updateTodoLoading])

  return (
    <Box py={1} display={'flex'} justifyContent={'space-between'}>
      {
        !isEdit &&
        <Box><FormControlLabel control={<Checkbox  onChange={(e) => setIsDone(e.target.checked)}/>} label={value}/></Box>
      }
      {
        isEdit &&
        <Box width={1} flex={1}>
          <TextField fullWidth value={message} size="small" variant="standard" onChange={(e) => {
          setMessage(e.target.value)
        }}/>
        </Box>
      }
      <Box>
        {
          !isEdit && 
          <>
            <IconButton disabled={isDone} onClick={() => setIsEdit(true)}><Icon>edit</Icon></IconButton>
            <IconButton color='error' disabled={isDone || deleteTodoLoading} onClick={() => {
              deleteTodo({variables: {id}})
            }}>
              {
                deleteTodoLoading ? <CircularProgress color='primary' size={12}/> : <Icon>delete</Icon>
              }
              </IconButton>
          </>
          
        }
        {
          isEdit &&
          <>
            <IconButton disabled={updateTodoLoading} onClick={() => {
              updateTodo({variables: {id, message}})
            }
            } color="success">
              {
                updateTodoLoading && <CircularProgress color='primary' size={12}/>
              }
              <Icon>done</Icon>
            </IconButton>
            <IconButton disabled={updateTodoLoading} onClick={() => {
              setIsEdit(false);
              setMessage(value)
            }} ><Icon>close</Icon></IconButton>
          </>
        }
      </Box>
    </Box>
  )
}, (prevProps, newProps) => {
  return prevProps.value == newProps.value && prevProps.id == newProps.id
})

const Todo = () => {
  const {
    data,
    loading: todosLoading,
    error
  } = useQuery(GetTodosQuery);
  const [addTodo, {loading: addTodoLoading }] = useMutation(CreateTodoMutation, {
    refetchQueries: [
      GetTodosQuery
    ]
  });
  const [message,setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('')

  const onAddTodo = () => {
    const cloneMessages = messages;
    if(message) {
      // messages.push(message);
      addTodo({variables:{message}})
      setMessage('')
      setMessages(cloneMessages);
      if(error) {
        setErrorMessage('')
      }
    } else {
      setErrorMessage('Required')
    }
    
  }

  useEffect(() => {
    if(data) {
      setMessages(data.todos.data)
    }
  }, [data])

  return (
    <Box p={3}>
      <Container maxWidth="sm">
        <Paper elevation={3}>
          <Box p={3}>
            <Box display={'flex'} alignItems={'center'}>
              <TextField fullWidth value={message} size="small" label="message" variant="standard" 
              onChange={(e) => {
                const value = e.target.value;
                setMessage(e.target.value);
                if(value) {
                  if(errorMessage) {
                    setErrorMessage('')
                  }
                } else {
                  setErrorMessage('Required')
                }
              }}
              helperText={errorMessage}
              error={!!errorMessage}
              />
              <Box mx={1}><Button disabled={addTodoLoading} variant='contained' onClick={onAddTodo}>
                {
                  addTodoLoading &&
                  <CircularProgress color='primary' size={24}/>
                }
                <Icon>add</Icon></Button>
              </Box>
            </Box>
            <Box mt={3}>
              {
                messages.map((item, index) => {
                  return <TodoItem key={item.id} value={item.attributes.message} id={item.id}/>
                })
              }
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GetTodosQuery,
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Todo;