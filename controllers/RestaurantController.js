import fs from 'fs';
import {Restaurant} from '../models';

class UsersController {
    static restaurant = async (req, res, next) => {
        try {
            const result = await Restaurant.findAll();
            res.json({
                result,
            });
        } catch (e) {
            next(e);
        }
    }

    static postRestaurant = async (req, res, next) => {
        try {
            const {file} = req;
            const {
                name, subName, address, userId
            } = req.body;

            const result = await Restaurant.create({
                name, subName, address, userId
            });

            const fileTypes = {
                'image/jpeg': '.jpg',
                'image/png': '.png',
                'image/gif': '.gif',
            };

            const imageDir = `public/images/restaurants/${result.id}/`;
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, {recursive: true});
            }
            const logo = `${file.fieldname}-${Date.now()}${fileTypes[file.mimetype]}`;
            fs.writeFileSync(imageDir + logo, file.buffer);

            result.logo = logo;
            await result.save();

            res.json({
                status: 'ok',
                result,
            });
        } catch (e) {
            next(e);
        }
    }

    static updateRestaurant = async (req, res, next) => {
        try {
            const {file} = req;
            const {id, name, subName, address, userId} = req.body;
            let logo;
            if (file) {
                const removeDir = `public/images/restaurants/${id}/`;
                if (fs.existsSync(removeDir)) {
                    fs.rmdirSync(removeDir, {recursive: true})
                }
                const fileTypes = {
                    'image/jpeg': '.jpg',
                    'image/png': '.png',
                    'image/gif': '.gif',
                };
                const newDir = `public/images/restaurants/${id}/`;
                if (!fs.existsSync(newDir)) {
                    fs.mkdirSync(newDir, {recursive: true});
                }
                logo = `${file.fieldname}-${Date.now()}${fileTypes[file.mimetype]}`;
                fs.writeFileSync(newDir + logo, file.buffer);
            }
            const result = await Restaurant.update({
                name, subName, address, userId, logo,
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

    static deleteRestaurant = async (req, res, next) => {
        try {
            const {id} = req.body;
            const result = await Restaurant.destroy({
                where: {
                    id,
                }
            });
            const imageDir = `public/images/restaurants/${id}/`;
            if (fs.existsSync(imageDir)) {
                fs.rmdirSync(imageDir, {recursive: true})
            }

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
