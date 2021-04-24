import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import {Users} from '../models';
import {v4 as uuidv4} from 'uuid';
import transporter from '../middlewares/nodemailer';
import Validate from "../config/validate";

const {JWT_SECRET, VERIFICATION_URL, CONFIRM_URL} = process.env;

class UsersController {
    static myAccount = async (req, res, next) => {
        try {
            const result = await Users.findByPk(req.userId);
            res.json({
                result,
            });
        } catch (e) {
            next(e);
        }
    }
    static register = async (req, res, next) => {
        try {
            await Validate(req.body, {
                firstName: 'string|required|alpha|minLength:2|maxLength:20',
                lastName: 'string|required|alpha|minLength:3|maxLength:20',
                phone: 'required|minLength:3|maxLength:20',
                email: 'required|email',
                password: 'required|minLength:4|maxLength:20',
            })
            const {firstName, lastName, phone, email, password} = req.body
            const activation_code = uuidv4();
            const unique = await Users.findOne({
                where: {
                    email
                }
            })
            if (unique) {
                res.json({
                    errors: {
                        email: "This email is already busy"
                    }
                })

            }
            const user = await Users.create({
                firstName,
                lastName,
                phone,
                activation_code,
                email,
                password,
            });
            let confInfo = `
                 <div style="width: 100%;height:350px;display: flex;
                justify-content: space-between;align-items: center;flex-direction: column;">
                    <div style="width: 100%;height: 80px;font-weight: bold;font-size: xxx-large;
                    background: black;color: orangered;display: flex;justify-content: center;
                    align-items: center; margin-bottom: 20px;font-family: monospace;">QR Restaurant</div>
                    <h1>Welcome to our site</h1>
                    <strong>Hi ${firstName + ' ' + lastName}</strong>
                    <p style="word-break: break-word;">
                    To complete email verification, please click the verify button below</p>
                    <a style="width: 150px;padding: 8px 20px;background: green;font-weight: bold;
                    display: flex;justify-content: center;align-items: center;color:white;
                    border-radius: 5px;word-break: break-word;text-decoration: none;"
                     href="${VERIFICATION_URL + activation_code}">Verify your Email</a>
                     <p style="word-break: break-word;">
                     If you did not create an account using this address, please ignore this email.
                     </p>
                     <i>Regards</i>
                     <strong>Team QR Restaurant</strong>
                </div>
            `
            await transporter.sendMail({
                from: '"QR Restaurant" <qrrestaurant@mail.ru>',
                to: email,
                subject: "Verification",
                text: "Hello " + firstName + lastName,
                html: confInfo,
            });
            res.json({
                status: 'Please verify your email',
                user,
            });
        } catch (e) {
            next(e);
        }
    }
    static userVerification = async (req, res, next) => {
        try {
            await Validate(req.body, {
                activation_code: 'required',
            })
            const {activation_code} = req.body
            const user = await Users.findOne({
                where: {
                    activation_code
                }
            });
            if (user) {
                await Users.update({
                    status: 'activated',
                }, {
                    where: {
                        id: user.id,
                    }
                });
                res.json({
                    status: 'Activated',
                });
            } else {
                res.json({
                    errors: "No such user. Try to register again."
                })
            }
        } catch (e) {
            next(e);
        }
    }
    static login = async (req, res, next) => {
        try {
            await Validate(req.body, {
                email: 'required|email',
                password: 'required'
            })
            const {email, password} = req.body;
            const result = await Users.findOne({
                where: {
                    email: email,
                },
            });

            if (!result || result.getDataValue('password') !== Users.passwordHash(password)) {
                throw HttpError(403, 'invalid email or password');
            }

            const token = jwt.sign({userId: result.id}, JWT_SECRET);

            res.json({
                status: 'ok',
                result,
                token,
            });
        } catch (e) {
            next(e);
        }
    }
    static resetPassword = async (req, res, next) => {
        try {
            await Validate(req.body, {
                email: 'required|email',
            })
            const {email} = req.body;
            const result = await Users.findOne({
                where: {
                    email,
                },
            });

            if (result) {
                const activation_code = uuidv4();
                await Users.update({
                    activation_code
                }, {
                    where: {
                        email,
                    },
                });
                let confInfo = `
                <div style="width: 100%;height:450px;display: flex;
                justify-content: space-between;align-items: center;flex-direction: column;">
                    <div style="width: 100%;height: 80px;font-weight: bold;font-size: xxx-large;
                    background: black;color: orangered;display: flex;justify-content: center;
                    align-items: center; margin-bottom: 20px;font-family: monospace;">QR Restaurant</div>
                    <h1>Welcome to our site</h1>
                    <strong>Hi ${result.firstName + ' ' + result.lastName}</strong>
                    <p style="word-break: break-word;">
                    You've recently asked to reset the password for this QR Restaurant account:</p>
                    <a href="mailto:${email}">${email}</a>
                    <p style="word-break: break-word;">To update your password, click the button below:</p>
                    <a style="width: 150px;padding: 8px 20px;background: #3572b0;font-weight: bold;
                    display: flex;justify-content: center;align-items: center;color:white;
                    border-radius: 5px;word-break: break-word;text-decoration: none;"
                     href="${CONFIRM_URL + activation_code}">Confirm your Email</a>
                     <i>Regards</i>
                     <strong>Team QR Restaurant</strong>
                </div>
            `
                await transporter.sendMail({
                    from: '"QR Restaurant" <qrrestaurant@mail.ru>',
                    to: email,
                    subject: "Verification",
                    text: "Hello " + result.firstName,
                    html: confInfo,
                });
                res.json({
                    status: 'Please confirm Email',
                    result,
                });
            } else {
                res.json({
                    errors: "No such user"
                });
            }
        } catch (e) {
            next(e);
        }
    }
    static changePassword = async (req, res, next) => {
        try {
            await Validate(req.body, {
                activation_code: 'required',
                password: 'required|minLength:4|maxLength:20',
            })
            const {activation_code, password} = req.body
            const user = await Users.findOne({
                where: {
                    activation_code
                }
            });
            if (user) {
                await Users.update({
                    password,
                }, {
                    where: {
                        id: user.id,
                    }
                });
                res.json({
                    status: 'Your password has changed',
                });
            } else {
                res.json({
                    errors: "No such user. Try again."
                })
            }
        } catch (e) {
            next(e);
        }
    }
    static update = async (req, res, next) => {
        try {
            await Validate(req.body, {
                firstName: 'string|required|alpha|minLength:2|maxLength:20',
                lastName: 'string|required|alpha|minLength:3|maxLength:20',
                phone: 'required|minLength:3|maxLength:20',
                email: 'required|email',
            })
            const {id, firstName, lastName, phone, email} = req.body;
            const result = await Users.update({
                firstName, lastName, phone, email,
            }, {
                where: {
                    id,
                }
            });
            res.json({
                status: 'Updated',
                result,
            });
        } catch (e) {
            next(e)
        }
    }
    static delete = async (req, res, next) => {
        try {
            await Validate(req.body, {
                id: 'required|integer',
            })
            const {id} = req.params;
            const result = await Users.destroy({
                where: {
                    id,
                }
            });

            res.json({
                status: 'Deleted',
                result,
            });
        } catch (e) {
            next(e)
        }
    }
}

export default UsersController;
