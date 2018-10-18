import React, { Component } from 'react'
import {
  TextField,
  Checkbox,
  Button,
  List,
  ListItem,
  Paper,
  ListItemText,
  IconButton,
  ListItemSecondaryAction
} from '@material-ui/core'
import {
  DeleteOutlined
} from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    maxWidth: 500,
    margin: '0 auto',
    fontFamily: 'Roboto, serif'
  },
  textField: {
    width: 400
  },
  add: {
    float: 'right',
    height: 80
  },
  title: {
    textAlign: 'center'
  },
  delete: {
    float: 'right',
    margin: theme.spacing.unit
  },
  todo: {
    color: 'black',
    fontFamily: 'Roboto, serif',
    fontSize: '1rem',
    fontWeight: 700
  }

})

class App extends Component {
  constructor() {
    super()
    this.state = {
      todos: []
    }
    this.handleAddTodo = this.handleAddTodo.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    fetch('/todos').then(response => {
      if (response.status === 200) {
        return response.json()
      }
    }).then(res => {
      this.setState({
        todos: res
      })
    }).catch(err => (
      console.error(err)
    ))
  }

  handleAddTodo(e) {
    e.preventDefault()
    fetch('/todos', {method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({task: `${e.target[0].value}`,
        isCompleted: false })})
      .then((res) => {
        return res.json()
      }).then(res => {
        let newTodos = this.state.todos.slice()
        newTodos.push(res)
        this.setState({
          todos: newTodos
        })
      }).catch(err => {
        console.error(err)
      })
    e.target.reset()
  }

  handleOnClick(id, todo) {
    const { todos } = this.state

    fetch(`/todos/${id}`, {method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({isCompleted: !todo.isCompleted})})
      .then(res => res.json())
      .then(res => {
        const newTodos = todos.map((todo) => {
          return (todo.id === id) ? Object.assign({}, res) : Object.assign({}, todo)

        })
        this.setState({
          todos: newTodos
        })
      })

  }

  deleteTodo(id) {
    const { todos } = this.state

    fetch(`/todos/${id}`, {method: 'DELETE'})
      .then(() => {
        const newTodos = todos.filter((todo) =>
          todo.id !== id)
        this.setState({
          todos: newTodos
        })
      })
  }
  render() {
    const {todos} = this.state
    const { classes } = this.props

    const listTodo = todos.map((todo) => (
      <ListItem key={todo.id} dense button>
        <Checkbox tabIndex={-1}
          checked={!!todo.isCompleted} onChange={() => this.handleOnClick(todo.id, todo)}/>
        <ListItemText primary={` ${todo.task}`}
          className={classes.todo}
          style={todo.isCompleted ? {textDecoration: 'line-through'} : {textDecoration: 'none'}}
        />
        { (todo.isCompleted) &&
          (<ListItemSecondaryAction>
            <IconButton>
              <DeleteOutlined className={classes.delete} onClick = {() => this.deleteTodo(todo.id)}/>
            </IconButton>
          </ListItemSecondaryAction>)}
      </ListItem>

    ))
    return (
      <div className={classes.root}>

        <h1 className={classes.title}>Todo List</h1>

        <form onSubmit={this.handleAddTodo}>
          <TextField className={classes.textField} label='new todo' margin='normal' variant='filled' required/>
          <Button className={classes.add} type='submit' color='primary'>Add</Button>
        </form>

        <Paper>
          <List>
            <form action='#'>
              {listTodo}
            </form>
          </List>
        </Paper>

      </div>

    )
  }
}

export default withStyles(styles)(App)
