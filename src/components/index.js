import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/uploadExcel'
import UploadImg from '@/components/UploadImg'

const components = [PageTools, UploadExcel, UploadImg]
export default {
  install(Vue) {
    components.forEach((component) => {
      Vue.component(component.name, component)
    })
  },
}
