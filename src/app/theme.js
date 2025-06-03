"use client"
import React, { useEffect, useState } from 'react';

export const useTheme = () => {

    const [isDarkMode, setIsDarkMode] = useState(true);
    useEffect(() =>{
      
        const displayMode = localStorage.getItem('displayMode');
        if (displayMode) {
        setIsDarkMode(displayMode === 'dark');
        
        } else {
        localStorage.setItem('displayMode', 'dark');
        setIsDarkMode(true);
        }
      
    })
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (isDarkMode) {
          localStorage.setItem('displayMode', 'light');
        } else {
          localStorage.setItem('displayMode', 'dark');
        }
      }
    return { isDarkMode, toggleDarkMode };

}


export const ThemeProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
    useEffect(()=>{
      setIsLoading(true)
      const isDarkMode = localStorage.getItem('displayMode') === 'dark';
      !isDarkMode ? document.documentElement.classList.remove('dark') : document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--modal-background', isDarkMode ? '#282828' : '#F9F9F9');
      document.documentElement.style.setProperty('--toast-text', isDarkMode ? '#FFFFFF' : '#000000');
      setIsLoading(false)
    })
    if(isLoading) {
      return null
    }
    return (
      
        <div>
            {children}
        </div>
    )
}