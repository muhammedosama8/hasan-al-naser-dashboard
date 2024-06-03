const Search = ({search, setSearch, placeholder}) =>{
    return(<div className="input-group w-50">
    <input 
        type="text" 
        style={{borderRadius: '8px', 
        color: 'initial', 
        padding: '18px 33px 18px 16px'}} 
        className="form-control" 
        placeholder={placeholder}
        value={search}
        onChange={e=> setSearch(e.target.value)} 
    />
    <div className="flaticon-381-search-2"
      style={{position: 'absolute', right: '16px', top: '50%', transform: 'translate(0, -50%)'}}
    ></div>
  </div>)
}
export default Search;