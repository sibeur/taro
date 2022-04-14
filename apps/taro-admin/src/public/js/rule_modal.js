Vue.createApp({
  data() {
    return {
      isLoading: false,
      allowedMimes: mimes,
      selectedMimes: [],
      name: null,
      maxSize: null,
      mime: null,
      driver: 'drive',
      errors: {
        name: null,
        maxSize: null,
        mime: null,
      },
    };
  },
  watch: {
    name(newValue) {
      this.onValidateName(newValue);
    },
    maxSize(newValue) {
      this.onValidateMaxSize(newValue);
    },
    mime(newMime) {
      this.onSelectMime(newMime);
      this.onValidateMime();
    },
  },
  methods: {
    emptyForm() {
      this.name = null;
      this.maxSize = null;
      this.selectedMimes = [];
      this.allowedMimes = mimes;
    },
    onModalClosed() {
      this.emptyForm();
    },
    isFormValid() {
      let isValid = true;
      Object.keys(this.errors).forEach((errKey) => {
        isValid = this.errors[errKey] != null ? false : true;
      });
      this.onValidateName(this.name);
      this.onValidateMaxSize(this.maxSize);
      this.onValidateMime();
      return isValid;
    },
    onValidateName(value) {
      if (!value || value.length < 1) {
        this.errors.name = 'Name cannot empty';
        return;
      }
      this.errors.name = null;
      return;
    },
    onValidateMaxSize(value) {
      if (!value || value < 1) {
        this.errors.maxSize = 'Max size min 1 value';
        return;
      }
      this.errors.maxSize = null;
      return;
    },
    onValidateMime() {
      if (this.selectedMimes.length < 1) {
        this.errors.mime = 'Please select mimes!';
        return;
      }
      this.errors.mime = null;
      return;
    },
    onDismissSelectedMime(mime) {
      this.selectedMimes = this.selectedMimes.filter(
        (selected) => selected.value != mime.value,
      );
      this.allowedMimes = [...this.allowedMimes, mime];
      this.onValidateMime(null);
    },
    onSelectMime(mime) {
      const [selectedMime] = this.allowedMimes.filter((el) => el.value == mime);
      this.selectedMimes = [...this.selectedMimes, selectedMime];
      this.allowedMimes = this.allowedMimes.filter((el) => el.value != mime);
    },
    async submitRule() {
      const body = {
        name: this.name,
        validations: {
          maxSize: this.maxSize,
          allowedMimes: this.selectedMimes.map((mime) => mime.value),
        },
        options: {
          storage: this.driver,
        },
      };
      this.isLoading = true;
      try {
        const url = `${media_api_url}/rules`;
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            version: '1',
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const dataJSON = await res.json();
        if (!res.ok) throw dataJSON;
        this.isLoading = false;
        location.href = `/rule/${dataJSON.data}`;
        return;
      } catch (error) {
        const { message } = error;
        alert(message[0]);
        this.isLoading = false;
        return;
      }
    },
    async onSubmitRule() {
      if (!this.isFormValid()) return;
      await this.submitRule();
      this.emptyForm();
    },
  },
}).mount('#add-rule-modal');
