<script lang="ts" setup>
import Uploader from "@/components/Uploader.vue";
import GenerateResp from "@/components/GenerateResp.vue";
import {onMounted, ref} from "vue";

const isScrolled = ref(false)

const uploadedFile = ref(null);
const patientName = ref(null);

const fileUploaded = (file) => {
  uploadedFile.value = file;
};

const patientNameSubmitted = (name) => {
  patientName.value = name;
};

const onProcessFailure = (error) => {
  patientName.value = null;
  uploadedFile.value = null;
};

onMounted(() => {
  window.addEventListener('scroll', function (event) {
    isScrolled.value = window.scrollY >= 5;
  })
})
</script>

<template>

  <h1 id="title">تحلیلگر صوت سخن یار</h1>
  <div class="spacer"/>
  <Uploader
      v-if="!uploadedFile || !patientName"
      @onFileUploaded="fileUploaded"
      @onPatientNameSubmitted="patientNameSubmitted"
  />
  <GenerateResp
      v-else
      :patientName="patientName"
      :uploadedFile="uploadedFile"
      @onFailure="onProcessFailure"
  />
  <div :class="['footer', (isScrolled) ? 'footer-shadow' : '']">
    <Divider v-if="isScrolled" id="footer-boarder"/>
    <p id="powered-by">
      قدرت یافته با
      <a id="powered-by-link" href="https://gemini.google.com" target="_blank">
        Gemini AI
      </a>
      <img id="powered-by-icon" alt="logo" src="../assets/gemini-icon.svg"/>
    </p>
    <a href="https://saltech.ir" rel="noopener noreferrer" target="_blank">
      <img id="company-logo" alt="صالتک" src="../assets/saltech.png"/>
    </a>
  </div>
</template>

<style scoped>
#title {
  font-weight: 625;
}

.spacer {
  height: 1.5rem;
}

.footer-shadow {
  /* https://smoothshadows.com/#djEsMSw0LDAuMDUsMzAsMzIsMCwjMDMwNzEyLCMwZjE3MmEsIzFlMjkzYiwx */
  box-shadow: 0 2px 2px rgba(3, 7, 18, 0.01),
  0 8px 8px rgba(3, 7, 18, 0.03),
  0 18px 17px rgba(3, 7, 18, 0.04),
  0 32px 30px rgba(3, 7, 18, 0.05);
}

.footer {
  z-index: 100;
  backdrop-filter: blur(0.55rem);
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

#powered-by {
  margin: 0.75rem 1.5rem 0.5rem 0;
  color: var(--p-secondary-color);
  font-size: 0.9rem;
  font-weight: 150;
}

#powered-by-link {
  font-weight: 250;
}

#powered-by-icon {
  width: 1rem;
  margin-top: -1rem;
}

#company-logo:hover {
  opacity: 0.85;
}

#company-logo {
  opacity: 0.63;
  width: 2.2rem;
  margin: 1rem 0 0.5rem 1.75rem;
}

@media (max-width: 400px) {
  #powered-by {
    scale: 0.9;
    margin-right: 0.75rem;
  }

  #company-logo {
    width: 1.8rem;
    margin-left: 1.5rem;
  }
}

@media (max-width: 265px) {
  #powered-by {
    scale: 0.8;
    margin-right: 0.5rem;
  }

  #company-logo {
    width: 1.5rem;
    margin-left: 1.25rem;
  }
}

@media (max-width: 235px) {
  #powered-by {
    scale: 0.7;
    margin-right: -1rem;
  }

  #company-logo {
    width: 1.3rem;
    margin-left: 0.5rem;
  }
}
</style>
