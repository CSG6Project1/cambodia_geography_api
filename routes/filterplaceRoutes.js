import express from 'express'
import fuzzysearch from 'fuzzy-search'
import Place from '../models/placeModels.js'
const router = express.Router()

//link: filterplaces/result?t=&pc=&dc=&cc=&vc=
//t=type, pc = province_code , dc = district_code, cc = commune_code, vc = village_code
router.get("/result",(req,res)=>{
    Place.find((err,docs)=>{
        if(!err){
            let province_search;
            let district_search;
            let commune_search;
            let village_search;
            console.log("__________________________________")
            console.log("place: " + req.query['t'])
            console.log("province code: " + req.query['pc'])
            console.log("district code: " + req.query['dc'])
            console.log("commune code: " + req.query['cc'])
            console.log("village code: " + req.query['vc'])
            function searching(obj,field,key){
                const searcher = new fuzzysearch(obj,[field],{caseSensitive: true})
                const result = searcher.search(key)
                return result;
            }
            if (req.query['t'] == "place"){
                let place_search=searching(docs,'type',req.query['t'])
                if(place_search.length != 0){
                    if(req.query['pc'] == "null" || req.query['pc'] == null){
                        province_search = place_search
                    }
                    else{
                        province_search=searching(place_search,'province_code',req.query['pc'])
                    }    
                    if(province_search.length != 0){
                        if(req.query['dc'] == "null" || req.query['dc'] == null){
                            district_search = province_search
                        }
                        else{
                            district_search=searching(province_search,'district_code',req.query['dc'])
                        } 
                        if (district_search.length != 0){
                            if(req.query['cc'] == "null" || req.query['cc'] == null){
                                commune_search = district_search
                            }
                            else{
                                commune_search=searching(district_search,'commune_code',req.query['cc'])
                            }
                            if(commune_search.length != 0){
                                if(req.query['vc'] == "null" || req.query['vc'] == null){
                                    village_search = commune_search
                                }
                                else{
                                    village_search=searching(commune_search,'village_code',req.query['vc'])
                                }                                
                                if(village_search.length != 0){
                                    res.json(village_search)                                    
                                }
                                else{
                                    res.send({ message: "no data not found in this village"})                                    
                                }
                            }
                            else{
                                res.send({ message: "no data not found in this commune"})                              
                            }
                        }
                        else{
                            res.send({ message: "no data not found in this district"})
                        }
                    }
                    else
                        res.send({ message: "no data not found in this province"})
                }
                else{
                    res.send({ message: "Data not found"})
                }                           
            }
            else if (req.query['t'] == "restaurant"){
                let place_search=searching(docs,'type',req.query['t'])
                if(place_search.length != 0){
                    if(req.query['pc'] == "null" || req.query['pc'] == null){
                        province_search = place_search
                    }
                    else{
                        province_search=searching(place_search,'province_code',req.query['pc'])
                    }    
                    if(province_search.length != 0){
                        if(req.query['dc'] == "null" || req.query['dc'] == null){
                            district_search = province_search
                        }
                        else{
                            district_search=searching(province_search,'district_code',req.query['dc'])
                        } 
                        if (district_search.length != 0){
                            if(req.query['cc'] == "null" || req.query['cc'] == null){
                                commune_search = district_search
                            }
                            else{
                                commune_search=searching(district_search,'commune_code',req.query['cc'])
                            }
                            if(commune_search.length != 0){
                                if(req.query['vc'] == "null" || req.query['vc'] == null){
                                    village_search = commune_search
                                }
                                else{
                                    village_search=searching(commune_search,'village_code',req.query['vc'])
                                }                                
                                if(village_search.length != 0){
                                    res.json(village_search)                                    
                                }
                                else{
                                    res.send({ message: "no data not found in this village"})                                    
                                }
                            }
                            else{
                                res.send({ message: "no data not found in this commune"})                              
                            }
                        }
                        else{
                            res.send({ message: "no data not found in this district"})
                        }
                    }
                    else
                        res.send({ message: "no data not found in this province"})
                }
                else{
                    res.send({ message: "Data not found"})
                }                  
            }
            else{
                res.send({ message: "Data not found"})
            }
        }
        else{ 
            res.send({ message: "Place model error"})
        }
    })
});

export default router