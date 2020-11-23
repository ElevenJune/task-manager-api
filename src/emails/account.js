const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to :email,
        from : "guillaume.vande@gmail.com",
        subject : "Thanks for joining in",
        text : `Welcome to this app ${name}, thanks for testing` //Attention au caractère utilisé, ` et non ' ou ""

    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to:email,
        from:"guillaume.vande@gmail.com",
        subject:"It's too bad to see you leave !",
        text: `Hi ${name} ! Is so sad to see you leave, I hope you had a create experience with this app. See you and take care !`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}