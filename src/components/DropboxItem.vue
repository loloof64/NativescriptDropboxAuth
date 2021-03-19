<template>
  <StackLayout
    orientation="horizontal"
    xmlns:svg="@sergeymell/nativescript-svg"
  >
    <SVGImage :src="imageSrc" class="icon" />
    <Label :text="name" class="nameText" lineHeight="100" />
  </StackLayout>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    folder: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const imageSrc = props.folder
      ? "~/assets/vectors/folder.svg"
      : "~/assets/vectors/file.svg";
    return { imageSrc };
  },
};
</script>

<style scoped>
.icon {
    width: 50;
    height: 50;
    margin: 5 10;
}
.nameText {
    text-align: left;
    vertical-align: middle;
  font-size: 20;
}
</style>
