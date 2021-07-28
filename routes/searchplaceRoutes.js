import express from 'express'
import fuzzysearch from 'fuzzy-search'
import Place from '../models/placeModels.js'
const router = express.Router()

///searchplaces/result?kw=

router.get("/result",(req,res)=>{
    if(!req.query['kw']){
        res.send({
            message: "Please input keyword[kw]"})
    }
    Place.find((err,docs)=>{
        if(!err){
            //searching
            const searcher = new fuzzysearch(docs,['khmer','english'],{caseSensitive: true})
            const result = searcher.search(req.query['kw'])
            //print some data
            // console.log(req.query["kw"])
            // console.log(result.length)
            // console.log("____________________________")
            //create temporary variable
            let str_replace="<b>"+`${req.query['kw']}`+"</b>"
            let str_toreplace = new RegExp(req.query['kw'],'g')
            //make key into bold
            if(req.query['kw'].charCodeAt(0) > 6000 && req.query['kw'].charCodeAt(0) < 6200){
                for (const prop in result) {
                    let tmp = result[prop]["khmer"]
                    result[prop]["khmer"]=tmp.replace(str_toreplace,str_replace)
                }
            }
            if(req.query['kw'].charCodeAt(0) >= 48 && req.query['kw'].charCodeAt(0) < 130){
                for (const prop in result) {
                    let tmp = result[prop]["english"]
                    result[prop]["english"]=tmp.replace(str_toreplace,str_replace)
                }
            }
            //response the result
            if (result.length != 0){
                res.json(result)
            }
            else{
                res.send({message:"Data not found"})
            }
        }
        else{ 
            res.send({message:"Error connection to model"})
        }
    }) 
});

export default router




