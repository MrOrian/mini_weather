import { useState, useEffect } from 'react'
import axios from "axios"
import "./App.css"
function App() {
  const [search, setSearch] = useState('')
  const [cities, setCities] = useState([])
  const [country, setCountry] = useState(null)
  const [temperature, setTemperature] = useState(null)
  const [cloud, setCloud] = useState(null)
  const [humidity, setHumidity] = useState(null)
  const [wind, setWind] = useState(null)
  const [sea_level, setSea_level] = useState(null)
  const [cityName, setCityName] = useState('Ho Chi Minh')
  const [currentTime, setCurrentTime] =useState(new Date())

  const formatTimeUnit = (unit) => {
    return unit.toString().padStart(2, '0');
  };

  useEffect(() => {
    const timeSet = setInterval(() => {
      setCurrentTime(new Date()) 
    },1000)
    return () => clearInterval(timeSet)
  }, [])

  useEffect(() => {
    const fetchData = () => {   
      const getApi = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=55ad6b6ec4698e7293c31b5db4369c2f`)
      getApi.then((response) => {
        const data = response.data;
        setCityName(data.name);
        setHumidity(data.main.humidity)
        setWind(data.wind.speed)
        setSea_level(data.main.sea_level)
        setCountry(data.sys.country)
        const temperature = (data.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
        setTemperature(temperature);

        const clouds = data.clouds.all;
        if (clouds === 0) {
          setCloud("Không mây");
        } else if (clouds < 50) {
          setCloud("Có mây");
        } else {
          setCloud("Nhiều mây");
        }

        
      })
      .catch((error) => {
        setCityName("Không tìm được thành phố và nhiệt độ");
        setTemperature(null);
        setCloud(null);
      });
    };

    fetchData(); // Call the function when the component mounts
    const intervalId = setInterval(fetchData, 60000); // Call the function every minute
    return () => clearInterval(intervalId); // Clear the interval when the component unmounts

  }, [cityName]);

  useEffect(()=>{
    const fetchDataCity = async () =>{
      return fetch('/city.list.json')
      .then(response => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCities(data);
          console.log(data);
      } else {
          console.error('Fetched data is not an array:', data);
      }
      })
      .catch(error => console.error("Lỗi truy xuất danh sách thành phố! ", error))
    }

    fetchDataCity()
  }, [])

    const handleCityClick = (cityName) => {
      setCityName(cityName)
      setSearch('')
    }

    const handleSearchChange = (event) => {    
      setSearch(event.target.value)
    }

    const filteredCities = cities
    .filter((city) => 
      search && city.name && city.name.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 7)
  
  return (
    <div className="app">
      <div className='header'>
        <div className='header-title'>
          <h1 className='title'>Mini Web ReactJS xem thời tiết theo thành phố</h1>
          <div className='time'>
            <h1 className='time-content'>
              {formatTimeUnit(currentTime.getHours())} <span/> giờ <span/>
              {formatTimeUnit(currentTime.getMinutes())} <span/> phút <span/>
              {formatTimeUnit(currentTime.getSeconds())} <span/> giây
            </h1>
          </div>
        </div>
      </div>
      
      <div className='container'>
        <div className='content'>
          <div className='main'>
            <h1>Thành phố {cityName}</h1>
            <div className='main-des'>
              <div className='basic'>
                <h2>Thông tin cơ bản</h2>
                <h3>Quốc gia: {country}</h3>
                <h3>Nhiệt độ: {temperature}°C</h3>
                <h3>Bầu trời: {cloud}</h3>
              </div>
              <div className='detail'>
                <h2>Thông tin thêm</h2>
                <h3>Độ ẩm: {humidity}%</h3>
                <h3>Tốc độ gió: {wind} Km/h</h3>
                <h3>Mực nước biển: {sea_level} mb</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='citiesContent'>
        <div className='inName'>
          <input  type='text' value={search} onChange={handleSearchChange} placeholder='Nhập vào tên thành phố'></input>
          <button className='search' onClick={() => handleCityClick(search)}><ion-icon name="search-outline"></ion-icon></button>
        </div>
        <ul className='citiesShow'>
        {filteredCities.map((city) => (
          (      
            <li className='cityName' key={city.id} onClick={() => handleCityClick(city.name)}>
              {city.name}, {city.country}
            </li>
          )
        ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
