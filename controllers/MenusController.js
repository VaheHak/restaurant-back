import fs from 'fs';
import {Menus} from '../models';

class UsersController {
    static menus = async (req, res, next) => {
        try {
            const result = await Menus.findAll();
            res.json({
                result,
            });
        } catch (e) {
            next(e);
        }
    }

    static createMenu = async (req, res, next) => {
        try {
            const {file} = req;
            const {
                name, price, description, restId, catId
            } = req.body;

            const result = await Menus.create({
                name, price, description, restId, catId
            });

            const fileTypes = {
                'image/jpeg': '.jpg',
                'image/png': '.png',
                'image/gif': '.gif',
            };

            const imageDir = `public/images/menus/${result.id}/`;
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, {recursive: true});
            }
            const image = `${file.fieldname}-${Date.now()}${fileTypes[file.mimetype]}`;
            fs.writeFileSync(imageDir + image, file.buffer);

            result.image = image;
            await result.save();

            res.json({
                status: 'ok',
                result,
            });
        } catch (e) {
            next(e);
        }
    }

    static updateMenu = async (req, res, next) => {
        try {
            const {file} = req;
            const {id, name, price, description, restId, catId} = req.body;
            let image;
            if (file) {
                const removeDir = `public/images/menus/${id}/`;
                if (fs.existsSync(removeDir)) {
                    fs.rmdirSync(removeDir, {recursive: true})
                }
                const fileTypes = {
                    'image/jpeg': '.jpg',
                    'image/png': '.png',
                    'image/gif': '.gif',
                };
                const newDir = `public/images/menus/${id}/`;
                if (!fs.existsSync(newDir)) {
                    fs.mkdirSync(newDir, {recursive: true});
                }
                image = `${file.fieldname}-${Date.now()}${fileTypes[file.mimetype]}`;
                fs.writeFileSync(newDir + image, file.buffer);
            }
            const result = await Menus.update({
                name, price, description, restId, catId, image,
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

    static deleteMenu = async (req, res, next) => {
        try {
            const {id} = req.body;
            const result = await Menus.destroy({
                where: {
                    id,
                }
            });
            const imageDir = `public/images/menus/${id}/`;
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
