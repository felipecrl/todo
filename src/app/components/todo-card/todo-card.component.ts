import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { TodoSignalsService } from 'src/app/services/todo-signals.service';
import { TodoKeyLocalStorage } from 'src/app/models/enum/todoKeyLocalStorage';
import { Todo } from 'src/app/models/model/todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './todo-card.component.html',
  styleUrls: []
})

export class TodoCardComponent implements OnInit {
  private todoSignalsService = inject(TodoSignalsService)
  private todoSignal = this.todoSignalsService.todoState
  public todosList = computed(() => this.todoSignal())

  public ngOnInit(): void {
    this.getTodos()
  }

  private getTodos() {
    const todosData = localStorage.getItem(TodoKeyLocalStorage.TODO_LIST) as string

    todosData && (this.todoSignal.set(JSON.parse(todosData)))
  }

  private saveTodosInLocalStorage() {
    this.todoSignalsService.saveTodos()
  }

  public handleDoneTodo(todoId: number): void {
    if (todoId) {
      this.todoSignal.mutate((todos) => {
        const todoSelected = todos.find((todo) => todo.id === todoId) as Todo

        todoSelected && (todoSelected.done = true)
        this.saveTodosInLocalStorage()
      })
    }
  }

  public handleDeleteTodo(todo: Todo): void {
    if (todo) {
      const index = this.todosList().indexOf(todo)

      if (index !== -1) {
        this.todoSignal.mutate((todos) => {
          todos.splice(index, 1)
          this.saveTodosInLocalStorage()
        })
      }
    }
  }
}
