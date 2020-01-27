<template>
  <div>This is an about page</div>
</template>

<script>
import axios from 'axios';


export default {
  name: 'about',

  async created() {
    let res;

    try {
      res = await axios.get('https://httpstat.us/201');
    } catch (err) {
      return console.error(err.message);
    }

    log('Okay');
    log(res);
  },
};

</script>
