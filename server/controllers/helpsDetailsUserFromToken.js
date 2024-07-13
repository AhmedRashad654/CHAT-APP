const jwt  = require('jsonwebtoken');
const { User } = require( '../Models/userSchema' );
async function DetailsFromToken( token ) {
    if ( !token ) {
        return {
            message: 'seccion out',
            logout:true
      }
    }
    const decode = await jwt.verify( token, process.env.SECRET_TOKEN || 'ahmed' );
    const user = await User.findById( decode.id );
    return user;
}
module.exports=DetailsFromToken