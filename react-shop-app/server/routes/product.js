const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({ storage: storage }).single('file')

router.post('/image', (req, res) => {
    // 가져온 이미지를 저장해주면 된다.
    upload(req, res, err => {
        if (err) {
            return req.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

})

router.post('/', (req, res) => {
    // 받아온 정보들을 DB애 넣어준다.
    const product = new Product(req.body)

    product.save((err) => {
        if (err) return res.status(400).json({ succcess: false, err })
        return res.status(200).json({ success: true })
    })
})

router.post('/products', (req, res) => {
    // product collection에 들어있는 모든 상품 정보를 가져온다.
    let limit = req.body.limit ? parseInt(req.body.limit) : 30;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm;

    let findArgs = {};

    for (let key in req.body.filters) {    // key = "continents" || "price"
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    // greater than equal
                    $gte: req.body.filters[key][0],
                    // less than equal
                    $lte: req.body.filters[key][1]
                }
            }
            else {
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    console.log('findArgs', findArgs)

    if (term) {
        Product.find(findArgs)
        .find({ "title": { '$regex': term } })
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if (err) return ers.status(400).json({ success: false, err })
            return res.status(200).json({ 
                success: true, 
                productInfo,
                postSize: productInfo.length
            })
        })
    } else {
        Product.find(findArgs)
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if (err) return ers.status(400).json({ success: false, err })
            return res.status(200).json({ 
                success: true, 
                productInfo,
                postSize: productInfo.length
            })
        })
    }        
})

router.get('/products_by_id', (req, res) => {
    let type = req.query.type    // body 아니고 query
    let productIds = req.query.id

    if (type === "array") {
        // id = 1234123, 1349041, 4527342 
        // -> 
        // productIds = ['1234123', '1349041', '4527342']
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })
    }

    // productId를 이용해서 DB에서 productId와 같은 상품 정보를 가져온다.
    Product.find({ _id: {$in: productIds }})
    .populate('writer')
    .exec((err, product) => {
        if (err) return res.status(400).send(err)
        return res.status(200).send(product)
    })
})


module.exports = router;