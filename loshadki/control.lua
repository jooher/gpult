local job = {}


-- parse the job text

function parsejob( fname )
  local text = io.read( fname or "default.job" )
  for i,str in ipairs(lines(text)) do
    job[i] = jobstep(str)
  end
end

function jobstep(str)
  local test,turn,wait = str:match("([^:]*):([^:]*):%s*([%d%s]*%d)%s*")
  return {
    test = lohi(test),
    turn = lohi(turn),
    wait = wait and times(wait)
  }
end

function lohi(str)
  local lo,hi = str:match("-*([%d%s])+([%d%s])")
  return {
    LO = bit.bnot(bits(lo)),
    HI = bits(hi)
  }
end

function bits(str)
  local map = 0
  for b in str:gmatch("%d+") do
    bit.set(map,tonumber(b))
  end
  return map
end
  
function times(str)
  local ts={}
  for t in str:gmatch("%d+") do
    ts:insert(t)
  end
  return ts
end

  

-- oo calling
local mytimer = tmr.create()
mytimer:register(5000, tmr.ALARM_SINGLE, function (t) print("expired") end)
mytimer:start()
mytimer = nil


-- current step

local test,turn,wait


function poll()
 if testSensors() then
   driveActors()
   nextStep()
  end
end


function testSensors()
  local sensors =  readSensors()
  return bit.band(test.HI,bit.bnot(sensors))==0 and bit.band(test.LO,sensors)==0
end
  

function driveActors()
  actors = bit.band(actors,turn.LO)
  actors = bit.bor(actors.turn.HI)
  writeActors(actors)
end