<template>
  <div class="container">
    <h2 class="text-center mt-5">My Todo List</h2>
    <div class="d-flex">
      <input
        v-model="task"
        class="form-control"
        type="text"
        placeholder="Enter Task"
      />
      <button
        @click="
          submitTask();
          persist();
        "
        class="btn btn-warning"
      >
        Submit
      </button>
    </div>

    <table class="table table-bordered mt-5">
      <thead class="bg-warning">
        <tr>
          <th scope="col">Task</th>
          <th scope="col">Status</th>
          <th scope="col">#</th>
          <th scope="col">#</th>
          <th scope="col">id</th>
        </tr>
      </thead>
      <tbody class="table-primary" v-if="count">
        <tr
          :class="{
            'table-danger': task.status === 'Finished',
            'table-success': task.status === 'In-progress',
          }"
          v-for="(task, index) in tasks"
          :key="index"
        >
          <th>
            <span
              class="nametask"
              :class="{ finished: task.status === 'Finished' }"
            >
              {{ task.name }}{{ index }}</span
            >
          </th>
          <td>
            <span @click="changeStatus(index)" class="pointer">
              {{ task.status }}</span
            >
          </td>
          <td>
            <div @click="editTask(index)">
              <span class="fa fa-pen"></span>
            </div>
          </td>
          <td>
            <div @click="deleteTask(index)">
              <span class="fa fa-trash"></span>
            </div>
          </td>
          <td>
            <div>
              <span>{{ task.id }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      database: null,
      id: 0,
      value: 0,
      db: [],
      index: 0,
      count: false,
      task: "",
      edittedTask: null,
      availableStatus: ["To-do", "In-progress", "Finished"],
      tasks: [
        {
          id: "",
          name: "",
          status: "",
        },
      ],
    };
  },
  mounted: function () {
    if (localStorage.tasks) {
      //
      this.setValue();
    }
  },
  async created() {
    this.tasks = await this.getTodoStore();
  },

  methods: {
    submitTask() {
      this.count = true;
      if (this.task.length === 0) {
        return;
      }
      if (this.index === 0) {
        this.tasks.splice(0, 1);
        //this.index++;
      }

      if (this.edittedTask === null) {
        this.saveTodo({
          name: this.task,
          status: this.availableStatus[0],
          id: this.id,
        });

        //console.log(this.index);
        this.tasks.push({
          id: this.id,
          name: this.task,
          status: this.availableStatus[0],
        });

        this.index++;
        this.id++;
      } else {
        this.tasks[this.edittedTask].name = this.task;
        this.saveTodo({
          name: this.task,
          status: this.status,
          id: this.edittedTask,
        });
        this.edittedTask = null;
      }

      this.task = "";
    },

    deleteTask(index) {
      this.value = this.tasks[index].id;
      this.tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(this.tasks));

      console.log("index:", index);
      console.log("value:", this.value);
      this.deleteTodo({
        id: this.value,
      });
    },

    editTask(id) {
      this.task = this.tasks[id].name;
      this.edittedTask = id;
    },
    changeStatus(index) {
      let newStatus = this.availableStatus.indexOf(this.tasks[index].status);
      if (++newStatus > 2) {
        newStatus = 0;
      }
      this.tasks[index].status = this.availableStatus[newStatus];
    },
    persist() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
    setValue() {
      //this.$router.go();
      const taskValue = JSON.parse(localStorage.getItem("tasks"));
      this.tasks = taskValue;
      this.count = true;
      return this.tasks;
    },
    async getTodoStore() {
      this.database = await this.getDatabase();
      return new Promise((resolve, reject) => {
        const transaction = this.database.transaction("todo", "readonly");
        const store = transaction.objectStore("todo");
        let todolist = [];
        store.openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            todolist.push(cursor.value);
            cursor.continue();
          }
        };
        transaction.onComplete = () => {
          resolve(todolist);
        };
        transaction.onerror = (event) => {
          reject(event);
        };
      });
    },
    async getDatabase() {
      return new Promise((resolve, reject) => {
        if (this.database) {
          resolve(this.database);
        }
        let request = window.indexedDB.open("todomvcDB", 1);
        request.onerror = (event) => {
          console.error("Error: unable to open database", event);
          reject("Error");
        };
        request.onsuccess = (event) => {
          this.database = event.target.result;
          resolve(this.database);
        };
        request.onupgradeneeded = (event) => {
          console.log("SSSS");
          let db = event.target.result;
          db.createObjectStore("todo", {
            autoIncrement: true,
            keyPath: "id",
          });
        };
      });
    },
    async saveTodo(task) {
      this.database = await this.getDatabase();
      return new Promise((resolve, reject) => {
        const transaction = this.database.transaction("todo", "readwrite");
        const store = transaction.objectStore("todo");
        store.put(task);
        transaction.onComplete = () => {
          resolve("item successfully saved");
        };
        transaction.onerror = (event) => {
          reject(event);
        };
      });
    },
    async deleteTodo(task) {
      this.database = await this.getDatabase();
      return new Promise((resolve, reject) => {
        const transaction = this.database.transaction("todo", "readwrite");
        const store = transaction.objectStore("todo");
        store.delete(task.id);
        transaction.onComplete = () => {
          resolve("item successfully deleted");
        };
        transaction.onerror = (event) => {
          reject(event);
        };
      });
    },
  },
};
</script>

<style scoped>
.pointer:hover {
  cursor: pointer;
  text-decoration: underline;
  color: rgb(194, 0, 253);
}
.finished {
  text-decoration: line-through;
}
td svg:hover {
  cursor: pointer;
  color: blueviolet;
}
</style>
