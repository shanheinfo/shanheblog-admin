import { ref, reactive } from 'vue'

const props = defineProps({
  tag: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])
const formRef = ref(null)

const formData = reactive({
  name: props.tag?.name || '',
  color: props.tag?.color || '#409EFF'
})

const rules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', formData)
    }
  })
}