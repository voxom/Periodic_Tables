import React, { useState, useEffect } from 'react'
import ErrorAlert from '../layout/ErrorAlert'
import { listReservations, listTables } from '../utils/api'


export default function Table({ table, index }) {
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const abortController = new AbortController()

        function loadReservations() {
            listReservations().then(setReservations).catch(setError)
        }
        loadReservations()
        return () => abortController.abort()
    }, [])

    useEffect(() => {
        const abortController = new AbortController()
        listTables(abortController.signal).catch(setError)
        return () => abortController.abort()
    }, [])

    const foundRes = reservations.find(res => Number(table.reservation_id) === Number(res.reservation_id))
    return (
        <div className='flex flex-row justify-center items-center drop-shadow-3xl mx-auto text-center w-8/12 sm:w-4/12 text-xl font-bold leading-10 bg-teal-500 text-gray-100 p-4 rounded-3xl'>
            <div key={index}>
                <ErrorAlert error={error} />
                <h2>Table Name: {table.table_name}</h2>
                <p>Capacity: {table.capacity}</p>
                <p data-table-id-status={`${table.table_id}`}>Status: {table.reservation_id ? 'Occupied by ' : 'Free'}</p>
                {foundRes && (
                    <p>{foundRes.first_name} {foundRes.last_name}</p>
                )}
            </div>
        </div>
    )
}