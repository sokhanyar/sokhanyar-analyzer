<script setup>
import Uploader from "@/components/Uploader.vue";
import GenerateResp from "@/components/GenerateResp.vue";
import {onMounted, ref} from "vue";
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();
const API_KEYS = [
  import.meta.env.VITE_API_KEY,
  import.meta.env.VITE_API_KEY_I,
  import.meta.env.VITE_API_KEY_II,
  import.meta.env.VITE_API_KEY_III,
  import.meta.env.VITE_API_KEY_IV,
  import.meta.env.VITE_API_KEY_V,
  import.meta.env.VITE_API_KEY_VI,
  import.meta.env.VITE_API_KEY_VII,
  import.meta.env.VITE_API_KEY_VIII,
  import.meta.env.VITE_API_KEY_IX,
  import.meta.env.VITE_API_KEY_X,
  import.meta.env.VITE_API_KEY_XI,
  import.meta.env.VITE_API_KEY_XII,
  import.meta.env.VITE_API_KEY_XIII,
  import.meta.env.VITE_API_KEY_IV,
];

const apiKey = ref(API_KEYS[Math.floor(Math.random() * API_KEYS.length)]);

const isScrolled = ref(false);
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
const systemDefaultTheme = systemSettingDark.matches;
const doubleCheckDialogVisible = ref(
    (cookies.get("double-check-dialog") ?? true) !== "0x3411",
);

const uploadedFile = ref(null);
const patientName = ref(null);

const fileUploaded = (file) => {
  uploadedFile.value = file;
};

const patientNameSubmitted = (name) => {
  patientName.value = name;
};

const onProcessFailure = () => {
  patientName.value = null;
  uploadedFile.value = null;
};

onMounted(() => {
  if (doubleCheckDialogVisible.value) {
    cookies.set("double-check-dialog", "0x3411");
  }
  window.addEventListener("scroll", function () {
    isScrolled.value = window.scrollY >= 5;
  });
});
</script>

<script>
export default {
  data() {
    return {
      showDivider: false,
      contentMargin: 0,
    };
  },
  mounted() {
    this.setContentMargin();
    this.checkContentPosition();
    window.addEventListener("scroll", this.checkContentPosition);
    window.addEventListener("resize", this.checkContentPosition);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.checkContentPosition);
    window.removeEventListener("resize", this.checkContentPosition);
  },
  methods: {
    setContentMargin() {
      const footer = this.$refs.footer;
      // ارتفاع div ثابت
      this.contentMargin = footer.getBoundingClientRect().height; // تنظیم margin-top برای محتوای content
    },
    checkContentPosition() {
      const footer = this.$refs.footer.getBoundingClientRect();
      const content = this.$refs.content.getBoundingClientRect();
      // محاسبه ارتفاع کل صفحه و موقعیت اسکرول
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      // اگر محتوا زیر fixed div باشد و صفحه قابلیت اسکرول داشته باشد
      this.showDivider =
          content.top < footer.bottom &&
          pageHeight > viewportHeight &&
          scrollPosition + 1 < pageHeight - viewportHeight;
    },
  },
};
</script>

<template>
  <Dialog
      v-model:visible="doubleCheckDialogVisible"
      header="سخن یار ممکن است اشتباه کند!"
      modal
      style="width: 75%"
  >
    <p class="m-0">
      هوش مصنوعی سخن یار، به دلیل اینکه همچنان در حال یادگیری است، ممکن است بعضی
      مواقع نتایجی که دلخواه شما نباشد را نشان دهد. لطفاً به بازخورد های او را
      بررسی و به آن نظر دهید و به یادگیری سریعتر و بهتر او کمک کنید.
    </p>
  </Dialog>
  <div ref="footer" :class="['footer', showDivider ? 'footer-shadow' : '']">
    <Transition>
      <Divider v-if="showDivider" id="footer-boarder"/>
    </Transition>
    <p id="powered-by" class="flex">
      قدرت یافته با &nbsp;
      <a id="powered-by-link" href="https://gemini.google.com" target="_blank">
        Gemini
      </a>
      <img id="powered-by-icon" alt="logo" src="@/assets/gemini-icon.svg"/>
    </p>
    <div id="logos" class="flex">
      <a
          href="https://clinic-negaheno.com"
          rel="noopener noreferrer"
          target="_blank"
      >
        <img
            id="negaheno-logo"
            :src="
            systemDefaultTheme
              ? '/../negaheno-dark.webp'
              : '/../negaheno-light.webp'
          "
            alt="نگاه نو"
        />
      </a>
      <a href="https://saltech.ir" rel="noopener noreferrer" target="_blank">
        <img id="company-logo" alt="صالتک" src="@/assets/saltech.webp"/>
      </a>
    </div>
  </div>
  <div
      ref="content"
      :style="{ marginBottom: contentMargin + 'px' }"
      class="content"
  >
    <h1 id="title">تحلیلگر صوت سخن یار</h1>
    <div class="spacer"/>
    <Uploader
        v-if="!uploadedFile || !patientName"
        :api-key="apiKey"
        @onFileUploaded="fileUploaded"
        @onPatientNameSubmitted="patientNameSubmitted"
    />
    <GenerateResp
        v-else
        :api-key="apiKey"
        :uploaded-file="uploadedFile"
        @onFailure="onProcessFailure"
    />
  </div>
</template>

<style scoped>
#title {
  font-weight: 700;
  font-size: 2.5rem;
  text-align: center;
  margin-right: 0.75em;
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

#logos {
  margin: 1rem 0 0.5rem 1.75rem;
}

#company-logo:hover,
#negaheno-logo:hover {
  opacity: 0.85;
}

#company-logo,
#negaheno-logo {
  opacity: 0.63;
  width: 2.2rem;
}

#negaheno-logo {
  margin: 0 0 0 1.5rem;
}

@media (max-width: 440px) {
  #powered-by {
    scale: 0.9;
    margin-right: 0.75rem;
  }

  #logos {
    margin-left: 1.5rem;
  }

  #company-logo,
  #negaheno-logo {
    width: 1.8rem;
  }
}

@media (max-width: 285px) {
  #powered-by {
    scale: 0.8;
    margin-right: 0.5rem;
  }

  #logos {
    margin-left: 1.25rem;
  }

  #company-logo,
  #negaheno-logo {
    width: 1.5rem;
  }
}

@media (max-width: 265px) {
  #powered-by {
    scale: 0.7;
    margin-right: -1rem;
  }

  #logos {
    margin-left: 0.5rem;
  }

  #company-logo,
  #negaheno-logo {
    width: 1.3rem;
  }
}

@media (max-width: 220px) {
  #powered-by {
    scale: 0.6;
    margin-right: -1.5rem;
  }

  #logos {
    margin-left: 0.25rem;
  }

  #company-logo,
  #negaheno-logo {
    width: 1.2rem;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.18s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
