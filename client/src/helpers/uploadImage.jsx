const url = `https://api.cloudinary.com/v1_1/dapsxrdb3/auto/upload`;

const uploadImage =async ( file ) => {
    const formData = new FormData()
    formData.append( 'file', file )
    formData.append( 'upload_preset', 'chat-app-file' )
    const response = await fetch( url, {
        method:"POST",
        body:formData
    } )
    const result = await response.json()
    return result
}
export default uploadImage