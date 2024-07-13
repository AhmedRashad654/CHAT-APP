const DetailsFromToken = require( "./helpsDetailsUserFromToken" )

async function userDetails( req, res ) {
    try {
        const token = req.cookies.token || ""
        const user = await DetailsFromToken( token )
        return res.status( 200 ).json( {
            massage: 'success Details',
            data:user
        })
    } catch ( error ) {
        return res.json( {
            message: error.message || error,
            error:true
        })
    }
}
module.exports=userDetails