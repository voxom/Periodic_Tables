import React, { useState } from "react"
import ErrorAlert from "../layout/ErrorAlert"
import ReservationCard from "./ReservationCard"

export default function Reservations({ reservations }) {
    const [error] = useState(null)
    return (
        <div className="flex flex-col sm:flex-row sm:justify-center flex-wrap">
            <ErrorAlert error={error} />
            {reservations.map(reservation => (
                <div key={reservation.reservation_id}>
                    <ReservationCard
                        reservation={reservation}
                    />
                </div>
            ))}
        </div>
    )
}