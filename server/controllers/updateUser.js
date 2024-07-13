const { User } = require( "../Models/userSchema" );
const DetailsFromToken = require("./helpsDetailsUserFromToken");
async function updateUser( req, res ) {
    try {
        const token = req.cookies.token || ''
        const user = await DetailsFromToken( token );
        const { name, profile_pic } = req.body
        const updated = await User.updateOne( { _id: user._id }, {
            name,
            profile_pic
        } )
        
        const findUser = await User.findById( user._id )
        return res.status( 200 ).json( {
            message: 'updated succesfully',
            data: findUser,
            success:true
        })
    } catch ( error ) {
        return res.status( 500 ).json( {
            message: error.message || error,
            error:true
        })
    }
}
module.exports = updateUser