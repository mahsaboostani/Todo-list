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
              {{ task.name }}</span
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
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
      count: false,
      task: "",
      edittedTask: null,
      availableStatus: ["To-do", "In-progress", "Finished"],
      tasks: [
        {
          name: "",
          status: "",
        },
      ],
    };
  },
  mounted: function () {
    if (localStorage.tasks) {
      this.index++;
      this.setValue();
    }
  },

  methods: {
    submitTask() {
      if (this.task.length === 0) {
        return;
      }
      if (this.index === 0) {
        this.tasks.splice(0, 1);
        this.index++;
      }

      if (this.edittedTask === null) {
        this.count = true;
        this.tasks.push({
          name: this.task,
          status: this.availableStatus[0],
        });
      } else {
        this.tasks[this.edittedTask].name = this.task;
      }
      this.edittedTask = null;
      this.task = "";
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      //window.location.reload();
    },
    editTask(index) {
      this.task = this.tasks[index].name;
      this.edittedTask = index;
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
