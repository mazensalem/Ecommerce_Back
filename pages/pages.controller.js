const Pages = require('./pages.model');

exports.getPages = async (req, res, next) => {
    const pages = await Pages.pages.find({deleted: false});
    res.status(200).json({msg: 'pages', data: pages});
}

exports.getPage = async (req, res, next) => {
    const page = await Pages.pages.findOne({deleted: false, slug: req.params.slug});
    res.status(200).json({msg: 'page', data: page});
}

exports.createPage = async (req, res, next) => {
    const {title, content, slug, active} = req.body;
    const page = await Pages.pages.create({title, content, slug, active});
    res.status(201).json({msg: 'created page', data: page});
}

exports.editPage = async (req, res, next) => {
    const slug = req.params.slug;
    const {title, content, nSlug, active} = req.body;
    const page = await Pages.pages.findOneAndUpdate({slug}, {title, content, slug: nSlug, active}, {new: true});
    res.status(200).json({msg: 'page edited', data: page});
}

exports.deletePage = async (req, res, next) => {
    const slug = req.params.slug;
    await Pages.pages.findOneAndUpdate({slug}, {deleted: true}, {new: true});
    res.status(200).json({msg: 'page edited', data: null});
}


exports.createTest = async (req, res, next) => {
    const user = req.user.name;
    const {text, ratting} = req.body;
    const Test = await Pages.testimonial.create({ratting, text, user});
    res.status(201).json({msg: 'created', data: Test});
}


exports.setTestStatus = async (req, res, next) => {
    const id = req.params.id;
    const Test = await Pages.testimonial.findByIdAndUpdate(id, {status: req.body.status}, {new: true});
    res.status(200).json({msg: 'edited', data: Test});
}


exports.getTests = async (req, res, next) => {
    const Tests = await Pages.testimonial.find({});
    res.status(200).json({msg: 'got', data: Tests});
}

exports.getApprovedTests = async (req, res, next) => {
    const Tests = await Pages.testimonial.find({status: 'approved'});
    res.status(200).json({msg: 'got', data: Tests});
}
