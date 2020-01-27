<template>
  <multiselect
    :hideSelected="true"
    :loading="loading"
    :options="colorSets"
    @input="$emit('input', selectedColorSet)"
    @search-change="suggest"
    class="colors"
    deselectLabel=""
    label="name"
    placeholder=""
    selectedLabel=""
    selectLabel=""
    track-by="id"
    v-model="selectedColorSet"
  >
    <template slot="singleLabel" slot-scope="props">
      <div
        :class="!Array.isArray(props.option.colors) ? 'colors__selected-option-wrap--colorset-no-colors' : null"
        :style="{background: Array.isArray(props.option.colors) ? gradient(props.option.colors) : null}"
        class="colors__selected-option-wrap colors__selected-option-wrap--colorset inline-flex f-middle"
      >
        <div class="colors__selected-option">
          {{props.option.name}}
        </div>
      </div>
    </template>

    <template slot="option" slot-scope="props">
      <div class="flex f-middle lpad-xs">
        <div
          :style="{background: Array.isArray(props.option.colors) ? gradient(props.option.colors) : null}"
          class="colors__option-color-preview colors__option-color-preview--colorset rgap-s"
        ></div>

        <div class="colors__option-text">{{props.option.name}}</div>
      </div>
    </template>
  </multiselect>
</template>

<script>
import chroma from 'chroma-js';

import * as helpers from '../helpers';


export default {
  name: 'ColorSetSelect',

  props: [
    'colorSets',
    'loading',
    'suggest',
    'value',
  ],

  data: () => ({
    selectedColorSet: null,
  }),

  methods: {
    gradient: colors => {
      const pointsStr = helpers.buildCssGradientPoints(colors.map(color => chroma(color.id).hex()));
      return `linear-gradient(90deg, ${pointsStr})`;
    },
  },

  watch: {
    value(selectedColorSet) {
      this.selectedColorSet = selectedColorSet;
    },
  },
};
</script>
