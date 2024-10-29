<script lang="ts" setup>
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { done, start } from "nprogress";
import axios from "axios";

const emit = defineEmits(["onFileUploaded", "onPatientNameSubmitted"]);

const toast = useToast();

const patientName = ref(" ");
const showBePatient = ref(false);

const selectedFile = ref(null);
const isUploading = ref(false);

async function uploadToGemini() {
  const timeoutId = setTimeout(() => {
    showBePatient.value = true;
  }, 20000);

  // if (!patientName.value) {
  //   toast.add({
  //     severity: "error",
  //     summary: "نام درمانجو را وارد کنید.",
  //     life: 3000,
  //     closable: false,
  //   });
  //   return;
  // }

  if (!selectedFile.value) {
    toast.add({
      severity: "error",
      summary: "خطا هنگام آپلود",
      detail: "هیچ فایلی انتخاب نشده است.",
      life: 3000,
      closable: false,
    });
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile.value, selectedFile.value.name);

  isUploading.value = true;
  start();
  await axios
    .post("https://ai.saltech.ir/api/upload/v1beta/files", formData, {
      headers: {
        "x-goog-api-key": `${import.meta.env.VITE_API_KEY}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      if (response.toString().includes("error")) {
        toast.add({
          severity: "error",
          summary: "خطا هنگام آپلود\nلطفاً مجدداً تلاش کنید.",
          detail: response.toString(),
          life: 3000,
          closable: false,
        });
      } else {
        const uploadResult = response.data;
        const uploadedFile = uploadResult.file;
        toast.add({
          severity: "success",
          summary: `فایل ${selectedFile.value.name} بارگذاری شد`,
          detail: "در حال پردازش اطلاعات ورودی ...",
          life: 2000,
          closable: false,
        });
        emit("onPatientNameSubmitted", patientName.value);
        emit("onFileUploaded", uploadedFile);
      }
    })
    .catch(function (error) {
      if (
        error.toString().includes("An error occurred due to the file upload.")
      ) {
        toast.add({
          severity: "error",
          detail: "خطا هنگام آپلود\nلطفاً مجدداً تلاش کنید.",
          life: 3000,
          closable: false,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "خطا هنگام آپلود",
          detail: error,
          life: 3000,
          closable: false,
        });
      }
    })
    .finally(function () {
      done();
      clearTimeout(timeoutId);
      showBePatient.value = false;
      isUploading.value = false;
    });
}

function onFileSelect(event) {
  selectedFile.value = event.files[0];
}
</script>

<template>
  <Toast />
  <div class="container">
    <p>فایل صوت مورد نظر خود را برای <b>بازخورد</b> بارگذاری کنید.</p>
    <p id="helper-text">
      <span class="pi pi-exclamation-triangle"></span>&nbsp;&nbsp;آپلود، به حجم
      فایل و سرعت اینترنت بستگی دارد.<br />اگر همچنان مشکلی داشت، صفحه را مجدداً
      بارگزاری کنید.
    </p>
    <div class="spacer-col" />
    <div class="uploader">
      <FileUpload
        id="choose-large"
        ref="file"
        v-tooltip.right="
          'فایل چالش یا کنفرانس رو که از گروه ایتا دریافت کرده اید، اینجا وارد کنید.\nمعمولاً در پوشه \'Eitaa Desktop\' (در ویندوز) یا \'Eitaa/Eitaa Audio\' (در اندروید) قرار می گیرد.'
        "
        :disabled="isUploading"
        :maxFileSize="52428800"
        accept="audio/*"
        aria-required="true"
        choose-label="انتخاب"
        class="choose"
        invalid-file-size-message="حداکثر حجم صوت: 50MB"
        mode="basic"
        name="file[]"
        @select="onFileSelect"
      />
      <FileUpload
        id="choose-small"
        ref="file"
        v-tooltip.click.right="
          'فایل چالش یا کنفرانس رو که از گروه ایتا دریافت کرده اید، اینجا وارد کنید.\nمعمولاً در پوشه \'Eitaa Desktop\' (در ویندوز) یا \'Eitaa/Eitaa Audio\' (در اندروید) قرار می گیرد.'
        "
        :disabled="isUploading"
        :maxFileSize="52428800"
        accept="audio/*"
        aria-required="true"
        choose-label=" "
        class="choose"
        invalid-file-size-message="حداکثر حجم صوت: 50MB"
        mode="basic"
        name="file[]"
        @select="onFileSelect"
      />
      <div class="spacer-row" />
      <Button
        id="upload-large"
        :disabled="!selectedFile || isUploading"
        :loading="isUploading"
        aria-label="upload"
        class="upload"
        icon="upload"
        icon-class="pi pi-upload"
        label="آپلود"
        severity="secondary"
        @click="uploadToGemini"
      >
      </Button>
      <Button
        id="upload-small"
        :disabled="!selectedFile || isUploading"
        :loading="isUploading"
        aria-label="upload"
        class="upload"
        icon="upload"
        icon-class="pi pi-upload"
        severity="secondary"
        @click="uploadToGemini"
      >
      </Button>
    </div>
    <p id="upload-help">Max: 50MB | *.mp3, *.ogg, *.aac</p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 1rem;
}

.patient-name {
  width: 75%;
}

#helper-text {
  margin-top: 1rem;
  color: var(--p-stone-500);
}

#upload-help {
  width: 100%;
  margin-top: 0.8rem;
  padding-left: 0.4rem;
  color: var(--p-red-400);
  text-align: left;
}

#upload-large,
#upload-small,
#choose-small,
#choose-large {
  display: none;
}

@media (min-width: 450px) {
  #upload-large,
  #choose-large {
    display: flex;
  }
}

@media (max-width: 450px) {
  #upload-small,
  #choose-small {
    display: flex;
  }
}

.uploader {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.spacer-col {
  height: 2rem;
}

.spacer-row {
  margin-right: 3rem;
}

@media (max-width: 400px) {
  .spacer-row {
    margin: 1rem;
  }
}

@media (max-width: 350px) {
  .spacer-row {
    margin: 0;
  }
}
</style>
