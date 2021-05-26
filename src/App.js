import React, { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { GlobalProvider, useData, usePrev, useSearch, useUpdData, useNext } from './GlobalContext'
import DelImg from './img/del.png'
import UpdImg from './img/upd.png'


const Pagination = ({ getData }) => {

  const next = useNext()[0]
  const prev = usePrev()[0]

  return (
    <div className="pagination">
      <button disabled={prev === false ? true : false} onClick={() => getData('prev')}>Prev</button>
      <button disabled={next === false ? true : false} onClick={() => getData('next')}>Next</button>
    </div>
  )
}

const DataContainer = ({ getData }) => {

  const [data, setData] = useData()

  return (
    <div>
      <div className="container">
        <div className="entry">
          <div className="first">
            <p>Gene Name</p>
            <p>Histology Subtype 1</p>
            <p>Histology Subtype 2</p>
            <p>Delete</p>
          </div>
        </div>
        {data.length && data.map((d) => <IndiData key={d._id} data={d} getData={getData} />)}
      </div>
      <Pagination getData={getData}></Pagination>
    </div>
  )
}

const IndiData = ({ data, getData }) => {

  const setData = useData()[1]
  const updData = useUpdData()

  const postData = () => {
    console.log(updData.current)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(updData.current);
    console.log(raw)

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:4001/update", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        alert('Updated!')
        getData()
      })
      .catch(error => console.log('error', error));
  }

  const delEntry = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "_id": id
    });

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:4001/delete", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        alert('Deleted!')
        getData()
      })
      .catch(error => console.log('error', error));
  }

  return (
    <div id={data._id} className="entry">
      <div className="outer">
        <p>{data.Gene_Name}</p>
        <p>{data.Histology_Subtype_1}</p>
        <p>{data.Histology_Subtype_2}</p>
        <div>
          <img src={UpdImg} alt="" onClick={() => {
            setData((prev) => {
              return prev.map((d) => {
                if (d._id === data._id) {
                  Object.keys(d).map((a) => updData.current[a] = d[a])
                  return { ...d, show: !d.show }
                }
                else {
                  return { ...d, show: false }
                }
              })
            })
          }} />
          <img src={DelImg} alt="" onClick={() => delEntry(data._id)} />
        </div>
      </div>
      <div className={data.show === true ? 'expand extra' : 'extra'}>
        {
          Object.keys(data).map((d) => {
            if (d !== '_id' && d !== 'show' && d !== '__v') {
              return (
                <div key={data._id + d}>
                  <p>{d}</p>
                  <div>
                    <p>{updData.current[d]}</p><input type="text" placeholder={'New ' + d} onChange={(e) => { updData.current[d] = e.target.value }} />
                  </div>
                </div>
              )
            }
          })
        }
        <button onClick={() => postData()}>Update</button>
      </div>
    </div>
  )
}

const SearchContainer = ({ getData }) => {

  const search = useSearch()

  return (
    <div className="inp">
      <select name="" id="" onChange={(e) => search.current.col = (e.target.value)}>
        <option value="_id">_id</option>
        <option value="Gene_Name">Gene Name</option>
        <option value="Transcript">Transcript</option>
        <option value="Census_Tier_1">Census Tier 1</option>
        <option value="Sample_Name">Sample Name</option>
        <option value="Sample_ID">Sample ID</option>
        <option value="AA_Mutation">AA Mutation</option>
        <option value="CDS_Mutation">CDS Mutation</option>
        <option value="Primary_Tissue">Primary Tissue</option>
        <option value="Tissue_Subtype_1">Tissue Subtype 1</option>
        <option value="Tissue_Subtype_2">Tissue Subtype2</option>
        <option value="Histology">Histology</option>
        <option value="Histology_Subtype_1">Histology Subtype 1</option>
        <option value="Histology_Subtype_2">Histology Subtype 2</option>
        <option value="Pubmed_Id">Pubmed Id</option>
        <option value="CGP_Study">CGP_Study</option>
        <option value="Somatic_Status">Somatic Status</option>
        <option value="Sample_Type">Sample Type</option>
        <option value="Zygosity">Zygosity</option>
        <option value="Genomic_Coordinates">Genomic Coordinates</option>
      </select>
      <input type="text" name="" id="" className="term" onChange={(e) => search.current.term = e.target.value} />
      <button onClick={() => { search.current.on = true; getData(undefined, 'search', search.current) }}>Search</button>
    </div>
  )
}

const Home = () => {

  const [data, setData] = useData()
  const [next, setNext] = useNext()
  const [prev, setPrev] = usePrev()
  const search = useSearch()

  const getData = (nextPrev, query) => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let type = search.current.on ? 'search' : 'all'
    let raw = {
      type: type,
    }
    if (type === 'search') {
      let q = {}
      q[`${search.current.col}`] = search.current.term
      raw['query'] = q
    }

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow'
    };


    let url;

    if (nextPrev === 'next') {
      url = "http://localhost:4001/entries?start=" + next + "&limit=10"
    }
    else if (nextPrev === 'prev') {
      url = "http://localhost:4001/entries?start=" + prev + "&limit=10"
    }
    else {
      url = "http://localhost:4001/entries?start=" + "0" + "&limit=10"
    }


    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        result.results.forEach(ele => ele['show'] = false)
        setData(result.results)

        if (result.next) {
          setNext(result.next.start)
        }
        else {
          setNext(false)
        }
        if (result.previous) {
          setPrev(result.previous.start)
        }
        else {
          setPrev(false)
        }
      })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <div>
      <SearchContainer getData={getData}></SearchContainer>
      <DataContainer getData={getData}></DataContainer>
    </div>
  )
}

const AddEntry = () => {

  const url = useRef('')
  const form = useRef({
    Gene_Name: "",
    Transcript: "",
    Census_Tier_1: "",
    Sample_Name: "",
    Sample_ID: "",
    AA_Mutation: "",
    CDS_Mutation: "",
    Primary_Tissue: "",
    Tissue_Subtype_1: "",
    Tissue_Subtype_2: "",
    Histology: "",
    Histology_Subtype_1: "",
    Histology_Subtype_2: "",
    Pubmed_Id: "",
    CGP_Study: "",
    Somatic_Status: "",
    Sample_Type: "",
    Zygosity: "",
    Genomic_Coordinates: "",
  })

  const postUsingUrl = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "url": url.current
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    let ok = true;
    fetch("http://localhost:4001/url", requestOptions)
      .then(response => {
        let res = response.json()
        if (!response.ok) {
          ok = false
        }
        return res
      })
      .then(result => {
        console.log(result)
        if (!ok) {
          throw result
        }
        alert('Entries Added')
      })
      .catch(error => alert(error));
  }

  const postData = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let ok = true
    var raw = JSON.stringify(form.current);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:4001/push", requestOptions)
      .then(response => {
        let res = response.json()
        if (!response.ok) {
          ok = false
        }
        return res
      })
      .then(result => {
        console.log(result)
        if (!ok) {
          throw result
        }
        alert("Entry Added!")
      })
      .catch(error => { console.log('error', error); alert(error._message) });
  }



  return (
    <div className="containerb">
      <div className="url">
        <input type="text" onChange={(e) => { url.current = e.target.value }} />
        <button onClick={() => postUsingUrl()}>Post Using Url</button>
      </div>
      <h1>Add Data Manually</h1>
      <div className="form">
        {
          Object.keys(form.current).map((d) => {
            return (
              <div key={d}>
                <p>{d}:</p>
                <input type="text" placeholder={d + " Value"} onChange={(e) => { form.current[d] = e.target.value }} />
              </div>
            )
          })
        }
        <button onClick={() => postData()}>Post Data</button>
      </div>
    </div>
  )
}

const App = () => {

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => {
          return (
            <GlobalProvider>
              <Home />
            </GlobalProvider>
          )
        }} />
        <Route path="/add" render={() => {
          return (
            <AddEntry />
          )
        }}>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
