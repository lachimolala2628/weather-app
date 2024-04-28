import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { IoMdSearch, IoMdSunny, IoMdRainy, IoMdCloudy, IoMdSnow, IoMdThermometer, IoMdThunderstorm } from 'react-icons/io'
import { BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind } from 'react-icons/bs'
import { TbTemperatureCelsius } from 'react-icons/tb'
import { ImSpinner8 } from 'react-icons/im'


const APIkey = 'da8a59c32cefdc7088ff18f86e190ce5';

const App = () => {

  const [data, setData] = useState(null);
  const [location, setLocation] = useState('Seoul');
  const [inputValue, setInputValue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMSg, setErrorMsg] = useState('');

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {

    if (inputValue !== '') {
      setLocation(inputValue);
    }

    const input = document.querySelector('input');

    if (input.value === '') {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }

    input.value = '';

    e.preventDefault();
  };

  useEffect(() => {

    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`

    axios.get(url).then((res) => {
      setTimeout(() => {
        setData(res.data);
        setLoading(false);
      }, 1500);
    }).catch(err => {
      setLoading(false);
      setErrorMsg(err);
    })
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg('')
    }, 2000);
    return () => clearTimeout(timer);
  }, [errorMSg])

  if (!data) {
    return (
      <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center'>
        <div><ImSpinner8 className='text-5xl animate-spin text-white  ' /></div>
      </div>
    )
  }

  let icon;

  switch (data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloudy />;
      break;
    case 'Rain':
      icon = <IoMdRainy className='text-[#31cafb]' />;
      break;
    case 'Snow':
      icon = <IoMdSnow className='text-[#31cafb]'/>
      break;
    case 'Haze':
      icon = <BsCloudHaze2Fill />
      break;
    case 'Clear':
      icon = <IoMdSunny className='text-[#ffde33]' />
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill className='text-[#31cafb]' />
      break;
    case 'ThunderStorm':
      icon = <IoMdThunderstorm />
      break;

    default:
      break;
  }

  const date = new Date();

  return (
    <>
      <div className='w-full h-screen bg-gradientBg bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4 lg:px-0'>
        {errorMSg && <div className='w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute top-2 lg:top-10 p-4 capitalize rounded-md'>{`${errorMSg.response.data.message}`}</div>}
        <form className={` ${animate ? 'animate-shake' : 'animate-none'} h-16 bg-black/20 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`} onChange={(e) => handleInput(e)}>
          <div className='h-full relative flex item-center justify-between p-2'>
            <input type="text" placeholder='Search by city or country' className='flex-1 bg-transparent outline-none text-white placeholder:text-white text-[15px] font-light pl-6 h-full' />
            <button onClick={(e) => handleSubmit(e)} className='bg-[#1ab8ed] w-20 h-12 rounded-full flex justify-center items-center transition hover:bg-[#15abdd]'><IoMdSearch className='text-white text-2xl' /></button>
          </div>
        </form>
        <div className='w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6'>
          {
            loading ? (
              <div className='w-full h-full flex justify-center items-center'><ImSpinner8 className='text-white text-5xl animate-spin' /></div>
            ) : (
              <div>
                <div className='flex items-center gap-x-5'>
                  <div className='text-[90px]'>{icon}</div>
                  <div className='text-2xl font-semibold'>{data.name}, {data.sys.country}</div>
                  <div>{date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}</div>
                </div>
                <div className='my-20'>
                  <div className='flex justify-center items-center'>
                    <div className='text-[144px] leading-none font-light '>{parseInt(data.main.temp)}</div>
                    <div className='text-4xl'><TbTemperatureCelsius /></div>
                  </div>
                  <div className='capitalize text-center'>{data.weather[0].description}</div>
                </div>
                <div className='max-w-[378px] mx-auto flex flex-col gap-y-6'>
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-x-2'>
                      <div className='text-[20px]'>
                        <BsEye />
                      </div>
                      <div className='ml-2'>
                        Visibility <span>{data.visibility / 1000} Km</span>
                      </div>
                    </div>
                    <div className='flex items-center gap-x-2'>
                      <div className='text-[20px]'>
                        <BsThermometer />
                      </div>
                      <div className='flex'>
                        Feels like
                        <div className='ml-2 flex'>{parseInt(data.main.feels_like)}</div>
                        <TbTemperatureCelsius />
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-x-2'>
                      <div className='text-[20px]'>
                        <BsWater />
                      </div>
                      <div className='ml-2'>
                        Humidity <span>{data.main.humidity} %</span>
                      </div>
                    </div>
                    <div className='flex items-center gap-x-2'>
                      <div className='text-[20px]'>
                        <BsWind />
                      </div>
                      <div>Wind
                        <span className='ml-2'>{data.wind.speed} m/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}

export default App