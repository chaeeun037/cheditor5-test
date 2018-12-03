<template>
  <section class="container">
    <div>
      <h2 class="subtitle">
        ckeditor5-test
      </h2>
      <textarea name="content" id="editor"/>
    </div>
  </section>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

let that = null

class UploadAdapter {

  constructor (loader) {
    this.loader = loader;
  }

  upload () {
    return new Promise(async (resolve, reject) => {
      try {
        let formData = new FormData()
        formData.append('file', this.loader.file)

        let res = await that.$api.file.create(formData)
        console.log(res)
        resolve({
          default: res.data.imagePath
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  abort () {
  }
}
export default {
  methods: {
    async upload() {

    }
  },
  mounted () {
    that = this
    ClassicEditor
        .create( document.querySelector( '#editor' ), { 
          ckfinder: {
            uploadUrl: 'http://127.0.0.1:7000/'
          }
        })
        .then( editor => {
          editor.plugins.get( 'FileRepository' ).createUploadAdapter = function( loader ) {
              return new UploadAdapter( loader );
          };
        })
        .catch( error => {
            console.error( error );
        } );
  }
}
</script>

<style>

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
