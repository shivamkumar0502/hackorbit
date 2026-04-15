import { useState } from "react";
import {
startOfMonth,
endOfMonth,
eachDayOfInterval,
format,
isSameDay,
addMonths,
subMonths
} from "date-fns";

function DailyActivity() {

const [currentMonth,setCurrentMonth] = useState(new Date());

/* Example solved days */
const activeDays = [
"2026-03-02",
"2026-03-03",
"2026-03-05",
"2026-03-08",
"2026-03-11",
"2026-03-17"
].map(d=>new Date(d));

const start = startOfMonth(currentMonth);
const end = endOfMonth(currentMonth);

const days = eachDayOfInterval({start,end});

const isActive = (day)=>{
return activeDays.some(d=>isSameDay(d,day));
};

return (

<div className="bg-[#1a1d23] p-5 rounded-xl w-full">

{/* HEADER */}

<div className="flex justify-between items-center mb-4">

<h2 className="text-lg font-semibold">
Daily Activity
</h2>

<div className="flex gap-2">

<button
onClick={()=>setCurrentMonth(subMonths(currentMonth,1))}
className="px-2"
>
◀
</button>

<button
onClick={()=>setCurrentMonth(addMonths(currentMonth,1))}
className="px-2"
>
▶
</button>

</div>

</div>

<p className="text-gray-400 mb-3">
{format(currentMonth,"MMMM yyyy")}
</p>

{/* WEEK LABELS */}

<div className="grid grid-cols-7 text-sm text-gray-400 mb-2">

{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
<div key={d}>{d}</div>
))}

</div>

{/* DAYS */}

<div className="grid grid-cols-7 gap-2">

{days.map(day=>(

<div
key={day}
className={`w-9 h-9 flex items-center justify-center rounded
${isActive(day) ? "bg-green-500 text-black" : "bg-[#2a2f3a]"}
`}
>

{format(day,"d")}

</div>

))}

</div>

{/* LEGEND */}

<div className="flex justify-between mt-4 text-xs text-gray-400">

<span>Less</span>

<div className="flex gap-1">
<div className="w-3 h-3 bg-[#2a2f3a] rounded"></div>
<div className="w-3 h-3 bg-green-300 rounded"></div>
<div className="w-3 h-3 bg-green-400 rounded"></div>
<div className="w-3 h-3 bg-green-500 rounded"></div>
</div>

<span>More</span>

</div>

</div>

);

}

export default DailyActivity;