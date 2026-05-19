import { message } from 'antd'
import { request } from './request'

export const exportFile = async ({
  url,
  filename = 'file.xlsx',
  method = 'get'
}) => {
  try {
    message.loading({
      content: 'Downloading...',
      key: 'export'
    })

    const res = await request(
      url,
      method,
      {},
      {
        responseType: 'blob'
      }
    )

    if (res.type === 'application/json') {
      const text = await res.text()
      const errorData = JSON.parse(text)

      message.error({
        content: errorData.message || 'Export failed!',
        key: 'export'
      })
      return
    }

    const blob = new Blob([res])
    const downloadUrl = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', `${filename}_${new Date().getTime()}.xlsx`)

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)

    message.success({
      content: 'Download successfully!',
      key: 'export'
    })
  } catch (err) {
    console.error(err)
    message.error({
      content: 'Download failed!',
      key: 'export'
    })
  }
}
