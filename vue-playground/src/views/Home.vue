<template>
  <div>
    <div class="f pad-s bgap-l">
      <colors-multiselect
        :colors="colors"
        :value="selectedColors"
        @input="selectedColorsChanged"
        v-loading="colorsLoading"
      />

      <pre style="background-color: #eee; max-height: 200px; overflow: auto">{{ JSON.stringify(selectedColors, null, 4) }}</pre>
    </div>

    <div class="g pad-s">
      <color-set-select
        :color-sets="colorSets"
        :loading="colorSetsLoading"
        :suggest="suggestColorSetsAsync"
        :value="selectedColorSet"
        @input="selectedColorSetChanged"
      />

      <pre style="background-color: #eee; max-height: 200px; overflow: auto">{{ JSON.stringify(selectedColorSet, null, 4) }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import chroma from 'chroma-js';
import _ from 'lodash';
import * as util from '@arturbaybulatov/util-js'; // TODO: Import via webpack

import ColorSetSelect from '../components/ColorSetSelect.vue';
import ColorsMultiselect from '../components/ColorsMultiselect.vue';


const { ensure } = util;

const getColorsAsync = async () => {
  // const colors = ensure.array(await axios.get(`${process.env.VUE_APP_API_URL}/api/directory/color`, {
  //   headers: { Authorization: process.env.VUE_APP_API_AUTH_TOKEN },
  // }));
  //
  // localStorage.setItem('colors-cached-n9I38VjA', JSON.stringify(colors)); // Debug

  const colors = ensure.array(JSON.parse(localStorage.getItem('colors-cached-n9I38VjA'))); // Debug

  return colors;
};

const getBrandColorSetsAsync = async (brandId, query) => {
  ensure.integer(brandId);
  ensure.string(query);

  // const url = `${process.env.VUE_APP_API_URL}/api/directory/colorset/brand/${brandId}/find/name?name=${encodeURIComponent(query)}`;
  //
  // const colorSets = ensure.array(await axios.get(url, {
  //   headers: { Authorization: process.env.VUE_APP_API_AUTH_TOKEN },
  // }));
  //
  // localStorage.setItem('color-sets-cached-xC7RrkTe', JSON.stringify(colorSets)); // Debug

  const colorSets = ensure.array(JSON.parse(localStorage.getItem('color-sets-cached-xC7RrkTe'))); // Debug

  return colorSets;
};

export default {
  name: 'home',

  components: {
    ColorSetSelect,
    ColorsMultiselect,
  },

  data: () => ({
    colorSets: [],
    selectedColorSet: null,
    colorSetsLoading: false,

    colors: [],
    selectedColors: [],
    colorsLoading: false,
  }),

  methods: {
    async suggestColorSetsAsync(query) {
      if (!util.isNonEmptyString(query)) return;

      const randomBrandId = 25812;

      try {
        this.colorSetsLoading = true;
        this.colorSets = await getBrandColorSetsAsync(randomBrandId, query);
      } catch (err) {
        this.$notify.error({
          title: 'Не удалось получить тона',
          message: err.message,
          duration: 0,
        });
      } finally {
        this.colorSetsLoading = false;
      }
    },

    selectedColorsChanged(selectedColors) {
      this.selectedColors = selectedColors;
      this.selectedColorSet = null;
    },

    selectedColorSetChanged(selectedColorSet) {
      this.selectedColorSet = selectedColorSet;

      if (!_.isPlainObject(selectedColorSet)) return;

      if (Array.isArray(selectedColorSet.colors)) {
        return (this.selectedColors = selectedColorSet.colors);
      }

      this.selectedColors = [];
    },
  },

  async mounted() {
    let colors;

    try {
      this.colorsLoading = true;
      colors = await getColorsAsync();
    } catch (err) {
      this.$notify.error({
        title: 'Не удалось получить цвета',
        message: err.message,
        duration: 0,
      });
    } finally {
      this.colorsLoading = false;
    }

    colors = _.orderBy(colors, [
      color => chroma(color.id).get('hsl.h'),
      color => chroma(color.id).luminance(),
    ]);

    this.colors = colors;

    this.selectedColorSet = {
      id: 1234,
      name: 'Lorem ipsum',
    };
  },
};
</script>
