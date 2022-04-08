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
    name(newValue, oldValue) {
      this.onValidateName(newValue);
    },
    maxSize(newValue, oldValue) {
      this.onValidateMaxSize(newValue);
    },
    mime(newMime, oldMime) {
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
      console.log(this.errors);
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
    submitRule() {
      if (!this.isFormValid()) return;
      console.log('submit!');
      this.emptyForm();
    },
  },
}).mount('#add-rule-modal');
