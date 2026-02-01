import { shallowMount } from '@vue/test-utils'
import TodoItem from '@/components/todos/TodoItem.vue'

jest.mock('@iconify/vue2', () => ({
  Icon: { template: '<span />' }
}))

describe('TodoItem', () => {
  const mockTodo = {
    _id: '1',
    title: 'Test Todo',
    description: 'Test description',
    completed: false,
    listName: 'Work'
  }

  it('shows todo title', () => {
    const wrapper = shallowMount(TodoItem, { propsData: { todo: mockTodo } })

    expect(wrapper.text()).toContain('Test Todo')
  })

  it('emits toggle-complete when checkbox clicked', async () => {
    const wrapper = shallowMount(TodoItem, { propsData: { todo: mockTodo } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('toggle-complete')).toBeTruthy()
    expect(wrapper.emitted('toggle-complete')![0]).toEqual([mockTodo])
  })

  it('emits delete when delete button clicked', async () => {
    const wrapper = shallowMount(TodoItem, { propsData: { todo: mockTodo } })

    await wrapper.findAll('button').at(2).trigger('click')

    expect(wrapper.emitted('delete')![0]).toEqual([mockTodo])
  })
})
