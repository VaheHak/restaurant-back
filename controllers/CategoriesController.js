import {Categories} from "../models";
import fs from "fs";


class CategoriesController {
    static getCategories = async (req, res, next) => {
        try {
            const result = await Categories.findAll()
            res.json({
                status: 'ok',
                result,
            })
        } catch (e) {
            next(e)
        }
    }

    static createCategories = async (req, res, next) => {
        try {
            const {file} = req
            const {name, description} = req.body;

            const result = await Categories.create({
                name, description
            })
            const fileTypes = {
                'image/jpeg': '.jpg',
                'image/png': '.png',
                'image/gif': '.gif',
            };
            const imageDir = `public/images/categories/${result.id}/`;
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, {recursive: true});
            }
            const images = `${file.fieldname}-${Date.now()}${fileTypes[file.mimetype]}`;
            fs.writeFileSync(imageDir + images, file.buffer);

            result.image = images;
            await result.save();

            res.json({
                status: 'ok',
                result,
            })
        } catch (e) {
            next(e)
        }
    }

    static updateCategories = async (req, res, next)=>{
        try{
            const {file} = req
            const {id, name, description} = req.body;

            let image;
            if (file) {
                const removeDir = `public/images/categories/${id}/`;
                if (fs.existsSync(removeDir)) {
                    fs.rmdirSync(removeDir, {recursive: true})
                }
                const fileTypes = {
                    'image/jpeg': '.jpg',
                    'image/png': '.png',
                    'image/gif': '.gif',
                };
                const newDir = `public/images/categories/${id}/`;
                if (!fs.existsSync(newDir)) {
                    fs.mkdirSync(newDir, {recursive: true});
                }
                image = `${file.fieldname}-${Date.now()}${fileTypes[file.mimetype]}`;
                fs.writeFileSync(newDir + image, file.buffer);
            }
            const result = await Categories.update({
                name, description, image,
            }, {
                where: {
                    id,
                }
            });

            res.json({
                status:'ok',
                result,
            })
        }catch (e){
            next(e)
        }
    }

    static deleteCategories = async (req, res, next) => {
        try {
            const {id} = req.body;
            await Categories.destroy({
                where: {
                    id,
                }
            })
            const imageDir = `public/images/categories/${id}/`;
            if (fs.existsSync(imageDir)) {
                fs.rmdirSync(imageDir, {recursive: true})
            }
            res.json({
                status: 'Deleted',
            });
        } catch (e) {
            next(e)
        }
    }
}

export default CategoriesController;