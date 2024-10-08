<script lang="ts" setup>
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { start, done } from "nprogress";
import axios from "axios";

const emit = defineEmits(["onFileUploaded", "onPatientNameSubmitted"]);

const toast = useToast();

const patientName = ref(null);

const selectedFile = ref(null);
const isUploading = ref(false);

const apiKey = import.meta.env.VITE_API_KEY;

async function uploadToGemini() {
  if (!patientName.value) {
    toast.add({
      severity: "error",
      summary: "نام درمانجو را وارد کنید.",
      life: 3000,
      closable: false,
    });
    return;
  }

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
        "x-goog-api-key": `${apiKey}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      const uploadResult = response.data;
      const uploadedFile = uploadResult.file;
      // toast.add({
      //   severity: "success",
      //   summary: `فایل ${selectedFile.value.name} بارگذاری شد`,
      //   detail: "در حال پردازش اطلاعات ورودی ...",
      //   life: 2000,
      //   closable: false,
      // });
      emit("onPatientNameSubmitted", patientName.value);
      emit("onFileUploaded", uploadedFile);
    })
    .catch(function (error) {
      toast.add({
        severity: "error",
        summary: "خطا هنگام آپلود",
        detail: error,
        life: 3000,
        closable: false,
      });
    })
    .finally(function () {
      done();
      isUploading.value = false;
      selectedFile.value = null;
    });
}

function onFileSelect(event) {
  selectedFile.value = event.files[0];
}
</script>

<template>
  <Toast />
  <div class="container">
    <p>
      فایل صوت مورد نظر خود را برای <b>بازخورد</b> بارگذاری و نام درمانجو را
      وارد کنید.
    </p>
    <div class="spacer-col" />
    <InputText
      v-model="patientName"
      :aria-disabled="isUploading"
      :disabled="isUploading"
      aria-required="true"
      class="patient-name"
      placeholder="نام درمانجو"
      size="small"
      type="text"
    />
    <div class="spacer-col" />
    <div class="uploader">
      <FileUpload
        ref="file"
        :disabled="isUploading"
        :maxFileSize="52428800"
        accept="audio/*"
        aria-required="true"
        choose-label="انتخاب"
        class="choose"
        id="choose-large"
        invalid-file-size-message="حداکثر حجم صوت: 50MB"
        mode="basic"
        name="file[]"
        @select="onFileSelect"
        v-tooltip.right="
          'فایل چالش یا کنفرانس رو که از گروه ایتا دریافت کرده اید، اینجا وارد کنید.\nمعمولاً در پوشه \'Eitaa Desktop\' (در ویندوز) یا \'Eitaa/Eitaa Audio\' (در اندروید) قرار می گیرد.'
        "
      />
      <FileUpload
        ref="file"
        :disabled="isUploading"
        :maxFileSize="52428800"
        accept="audio/*"
        aria-required="true"
        choose-label=" "
        class="choose"
        id="choose-small"
        invalid-file-size-message="حداکثر حجم صوت: 50MB"
        mode="basic"
        name="file[]"
        @select="onFileSelect"
        v-tooltip.click.right="
          'فایل چالش یا کنفرانس رو که از گروه ایتا دریافت کرده اید، اینجا وارد کنید.\nمعمولاً در پوشه \'Eitaa Desktop\' (در ویندوز) یا \'Eitaa/Eitaa Audio\' (در اندروید) قرار می گیرد.'
        "
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
