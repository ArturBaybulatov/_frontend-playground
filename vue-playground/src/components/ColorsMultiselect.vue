<template>
  <multiselect
    :clearOnSelect="false"
    :closeOnSelect="false"
    :hideSelected="true"
    :multiple="true"
    :options="colors"
    @input="$emit('input', selectedColors)"
    class="colors"
    deselectLabel=""
    label="name"
    placeholder=""
    selectedLabel=""
    selectLabel=""
    track-by="id"
    v-model="selectedColorsSorted"
  >
    <template slot="tag" slot-scope="props">
      <div
        @click="props.remove(props.option)"
        @mousedown.prevent
        @mouseleave="$set(props.option, '_removalIconVisible', false)"
        @mouseover="$set(props.option, '_removalIconVisible', true)"
        class="colors__selected-option-wrap inline-flex f-middle hoverable clickable rgap-xs"

        :style="{
          backgroundColor: chroma(props.option.id).hex(),
          color: chroma(props.option.id).luminance() < 0.5 ? 'white' : 'black',
        }"
      >
        <div
          :style="{zIndex: props.option._removalIconVisible ? '0' : '-1'}"
          class="colors__selected-option-remove-btn"
        >&times;</div>

        <div
          :style="{visibility: props.option._removalIconVisible ? 'hidden' : 'visible'}"
          class="colors__selected-option flex f-middle"
        >
          <div
            :style="{color: chroma(props.option.id).luminance() < 0.5 ? 'white' : 'black'}"
            class="colors__selected-option-overlay-icon"
            v-if="props.option._main"
          >&check;</div>

          <div>{{props.option.name}}</div>
        </div>
      </div>
    </template>

    <template slot="option" slot-scope="props">
      <div class="flex f-middle lpad-xs" @click="$set(props.option, '_removalIconVisible', false)">
        <div class="colors__option-color-preview rgap-s" :style="{backgroundColor: chroma(props.option.id).hex()}"></div>
        <div class="colors__option-text rgap-l" @click="$set(props.option, '_main', false)">{{props.option.name}}</div>

        <div
          @click="$set(props.option, '_main', true)"
          class="colors__option-link hoverable"
        >Выбрать как основной</div>
      </div>
    </template>
  </multiselect>
</template>

<script>
import _ from 'lodash';


export default {
  name: 'ColorsMultiselect',

  props: [
    'colors',
    // 'disabled',
    'value',
  ],

  data: () => ({
    selectedColors: [],
  }),

  computed: {
    selectedColorsSorted: {
      get() {
        return _.orderBy(this.selectedColors, [color => Boolean(color._main)], ['desc']);
      },

      set(selectedColors) {
        this.selectedColors = selectedColors;
      },
    },
  },

  watch: {
    value(selectedColors) {
      this.selectedColors = selectedColors;
    },
  },
};
</script>
