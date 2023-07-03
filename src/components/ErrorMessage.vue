<template>
  <div class="alert alert-danger text-center">
    <div class="">
      <i class="fa fa-exclamation-triangle me-2" aria-hidden="true"></i>
      <span>{{ message }}</span>
    </div>
    <div v-if="isFatal" class="mt-0-75rem">
      <button
        @click="reload()"
        type="button"
        class="btn btn-danger rounded-pill px-3"
      >
        <i class="fa fa-refresh me-2 lh-1" aria-hidden="true"></i>
        <span>Перезагрузить</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorMessage",
  props: {
    message: String,
    isFatal: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    reload() {
      location.reload();
    },
  },
};
</script>
