import { mount } from "@vue/test-utils";
import TodoList from "@/components/TodoList.vue";
import { loadPartialConfigAsync } from "@babel/core";

describe("TodoList.vue", () => {
  test("task showed in tasks array and saved in localstorage", async () => {
    const wrapper = mount(TodoList)
    localStorage.clear()
    const input = wrapper.find('input[type= "text"]')
    input.setValue('go somwhere')
    await expect(wrapper.find('button').trigger('click'))
    expect(wrapper.find('.nametask').text()).toEqual('go somwhere')
    const local = JSON.parse(localStorage.getItem("tasks"))
    expect((local[0]).name).toEqual('go somwhere')

  });
});
