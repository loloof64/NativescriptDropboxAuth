<template>
<ScrollView>
  <StackLayout backgroundColor="lightgray">
    <DropboxItem
      v-for="item in items"
      :key="item.name"
      :folder="item.isFolder"
      :name="item.name"
    />
  </StackLayout>
</ScrollView>
</template>

<script>
import DropboxItem from "@/components/DropboxItem";
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  components: {
    DropboxItem,
  },
  setup() {
  },
};
</script>
