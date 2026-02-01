import { shallowMount } from '@vue/test-utils'
import TodoInput from '@/components/todos/TodoInput.vue'

jest.mock('@/components/todos/ListDropdown.vue', () => ({
  name: 'ListDropdown',
  template: '<div />'
}))

describe('TodoInput', () => {
  it('emits add todo with form data', async () => {
    const wrapper = shallowMount(TodoInput)

    await wrapper.find('input[type="text"]').setValue('New Todo')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('add-todo')).toBeTruthy()
    expect(wrapper.emitted('add-todo')![0][0]).toMatchObject({
      title: 'New Todo',
      listName: 'General'
    })
  })

  it('does not emit when title is empty', async () => {
    const wrapper = shallowMount(TodoInput)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('add-todo')).toBeFalsy()
  })

})
