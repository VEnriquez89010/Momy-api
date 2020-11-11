var appSettings  = require('../models/app-settings');
const Crypt = require('../helpers/crypt');

module.exports.template = (user) => {
    let template = `
    
    <table>
      <tr>
        <td>
          <h1> Hola ${user.Name} !! </h1>
          <p>
               Restablezcamos tu contraseña para que puedas seguir disfrutando de <strong>Momy™</strong>.
                </br>
                </br>
              <a href="${appSettings.CLIENT_IP}/newpass/${Crypt.encryptAES(user._id)}">
                <h3>
                  Restablecer contraseña
                <h3>
              </a> 
          </p>
        </td>
      </tr>
    </table>
    <br>
    <br>
    <br>
     `

    return template;
}
