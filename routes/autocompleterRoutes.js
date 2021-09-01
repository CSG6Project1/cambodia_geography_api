import express from 'express'
import fuzzysearch from 'fuzzy-search'
import Place from '../models/placeModels.js'
import { getAutocompletePlaces } from '../controllers/autocompleterController.js'
const router = express.Router()

///autocompleter/result?keyword=

router.get("/result",getAutocompletePlaces(Place));

// router.get("/result",(req,res)=>{
//     if(!req.query['keyword']){
//         res.send({
//             message: "Please input keyword[keyword]"})
//     }
//     Place.find((err,docs)=>{
//         if(!err){
//             let final_result = {"data":[]}
//             let tmp_result = {}
//             //searching
//             const searcher = new fuzzysearch(docs,['khmer','english'],{caseSensitive: true})
//             const result = searcher.search(req.query['keyword'])
//             //print some data
//             // console.log(req.query["keyword"])
//             // console.log(result.length)
//             // console.log("____________________________")
//             //create temporary variable
//             let str_replace="<b>"+`${req.query['keyword']}`+"</b>"
//             let str_toreplace = new RegExp(req.query['keyword'],'g')
//             //make key into bold
//             if(req.query['keyword'].charCodeAt(0) > 6000 && req.query['keyword'].charCodeAt(0) < 6200){
//                 for (const prop in result) {
//                     let tmp = result[prop]["khmer"]
//                     result[prop]["khmer"]=tmp.replace(str_toreplace,str_replace)
//                 }
//             }
//             if(req.query['keyword'].charCodeAt(0) >= 48 && req.query['keyword'].charCodeAt(0) < 130){
//                 for (const prop in result) {
//                     let tmp = result[prop]["english"]
//                     result[prop]["english"]=tmp.replace(str_toreplace,str_replace)
//                 }
//             }   
//             //change type to autocomplete
//             for (const prop in result) {
//                 result[prop]["type"]="autocompleter"
//             }
//             //cut data
//             for (const prop in result) {
//                 tmp_result["_id"]=result[prop]["_id"]
//                 tmp_result["type"]=result[prop]["type"]
//                 tmp_result["khmer"]=result[prop]["khmer"]
//                 tmp_result["english"]=result[prop]["english"]
//                 final_result.data[prop]=tmp_result
//                 tmp_result={}
//             }
//             //response the result
//             if (result.length != 0){
//                 res.json(final_result)
//             }
//             else{
//                 res.send({message:"Data not found"})
//             }
//         }
//         else{ 
//             res.send({message:"Error connection to model"})
//         }
//     }) 
// });

export default router




