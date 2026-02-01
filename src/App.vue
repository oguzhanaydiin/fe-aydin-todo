<script lang="ts">
import Vue from 'vue'
import DesktopNavbar from '@/components/ui/DesktopNavbar.vue'
import MobileNavbar from '@/components/ui/MobileNavbar.vue'
import NewListModal from '@/components/modals/NewListModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

export default Vue.extend({
  name: 'App',
  components: {
    DesktopNavbar,
    MobileNavbar,
    NewListModal,
    ConfirmModal
  },
  data() {
    return {
      isMobileMenuOpen: false,
      isNewListModalOpen: false,
      isCreatingList: false,
      createError: null as string | null,
      isDeleteListModalOpen: false,
      listToDelete: null as string | null,
      isDeletingList: false
    }
  },
  computed: {
    lists(): string[] {
      return this.$store.getters['lists/all']
    },
    allTodos(): any[] {
      return this.$store.getters['todos/all']
    }
  },
  async mounted() {
    this.$store.dispatch('init')
  },
  methods: {
    confirmDeleteList(listName: string) {
      this.listToDelete = listName
      this.isDeleteListModalOpen = true
    },
    cancelDeleteList() {
      this.isDeleteListModalOpen = false
      this.listToDelete = null
    },
    async handleDeleteList() {
      if (!this.listToDelete) return

      try {
        this.isDeletingList = true
        await this.$store.dispatch('lists/deleteList', this.listToDelete)
        
        // Navigate to General if we're currently on the deleted list
        const currentListName = this.$route.params.list ? this.$route.params.list.replace(/_/g, ' ') : null
        if (currentListName === this.listToDelete) {
          this.$router.push('/')
        }
        
        this.isDeleteListModalOpen = false
        this.listToDelete = null
      } catch (error: any) {
        console.error('Error deleting list:', error)
      } finally {
        this.isDeletingList = false
      }
    },
    openNewListModal() {
      this.isNewListModalOpen = true
      this.createError = null
    },
    async handleNewList(listName: string) {
      try {
        this.isCreatingList = true
        this.createError = null
        await this.$store.dispatch('lists/addList', listName)
        this.isNewListModalOpen = false
        // Navigate to the new list
        this.$router.push(`/${listName.replace(/ /g, '_')}`)
      } catch (error: any) {
        this.createError = error.message || 'Failed to create list'
      } finally {
        this.isCreatingList = false
      }
    },
    cancelNewList() {
      this.isNewListModalOpen = false
      this.createError = null
    }
  }
})
</script>

<template>
  <div class="flex h-full">
    <!-- Mobile navbar -->
    <MobileNavbar
      :is-open="isMobileMenuOpen"
      :all-todos="allTodos"
      @open="isMobileMenuOpen = true"
      @close="isMobileMenuOpen = false"
      @open-new-list="openNewListModal"
      @delete-list="confirmDeleteList"
    />

    <!-- Desktop Navbar -->
    <DesktopNavbar
      :lists="lists"
      :all-todos="allTodos"
      @open-new-list="openNewListModal"
      @delete-list="confirmDeleteList"
    />

    <!-- Main content -->
    <main class="flex-1 overflow-hidden pt-14 md:pt-0">
      <router-view />
    </main>

    <!-- New List Modal -->
    <NewListModal
      :is-open="isNewListModalOpen"
      :loading="isCreatingList"
      :external-error="createError"
      @save="handleNewList"
      @cancel="cancelNewList"
    />

    <!-- Delete List Modal -->
    <ConfirmModal
      :is-open="isDeleteListModalOpen"
      title="Delete List"
      :message="`Are you sure you want to delete '${listToDelete}'?`"
      :loading="isDeletingList"
      loading-text="Deleting..."
      variant="danger"
      @confirm="handleDeleteList"
      @cancel="cancelDeleteList"
    />
  </div>
</template>
