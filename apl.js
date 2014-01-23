vt='"+,<{#~'
plus = (a,w) ->  {p: a.p[i]+w.p[i] for i in [0..(w.p.length-1)]}
cat = (a,w) -> {p:a.p.concat w.p}
box = (w) -> {p:[w.p],t:1}
id = (w) -> w
from = (a,w) -> {p:w.p[a.p..a.p]}
size = (w) -> {p:w.p.length}
rsh = (a,w) -> {p:w.p[i%w.p.length] for i in [0..a.p-1]}
sha = (w) -> {p:[if w.t then 0 else w.p.length]}
iota = (w) -> {p:i for i in [0..w.p-1]}

vd=[0,plus,cat,0,from,rsh,0] #dyadic verbs
vm=[0,id,0,box,size,sha,iota] #monadic verbs

noun = (c) -> if (c < '0' || c > '9') then 0 else {p:[c-'0'],t:1}
verb = (c) -> [i for i in [0..vt.length-1] when vt[i] is c][0][0]||0
wd = (s) -> noun(c) || verb(c) || c for c in s
val = (x) -> !(typeof x == "object") && x != undefined
qv = (c) -> val(c)
qp = (c) -> val(c) && (c>='a' || c<='z')
st= {}
ex = (e,x=0) ->
  a = e[x]  
  if (qp(a))
    if (e[x+1]=='=')
      return st[a]=ex(e,x+2)
    a=st[a]  
  if (qv(a))
    vm[a](ex(e, x+1))
  else if (val(e[x+1]))
    vd[e[x+1]](a, ex(e, x+2))
  else
    a

DEBUG=true
dbg = (m) -> console.log(m) if DEBUG
test = (m) -> console.log(m) 

test(ex(wd("5+1")).p[0] == 6)
test(ex(wd("b=5")).p[0] == 5)
test(ex(wd("+b")).p[0] == 5)
ex(wd("a=3"))
test(ex(wd("a+b")).p[0] == 8)
test(ex(wd("q=1,2")).p.length == 2)
test(ex(wd("m=2,4")).p.length == 2)
test(ex(wd("+q")).p.length == 2)
test(ex(wd("m+q")).p+'' is [3,6]+'')
test(ex(wd("m=2,4,6")).p+'' is [2,4,6]+'')
test(ex(wd("z=<1,2")).p+'' is [[1,2]]+'')
test(ex(wd("z,z")).p+'' is [[1,2],[1,2]]+'')
test(ex(wd("z,z")).p+'' is [[1,2],[1,2]]+'')
test(ex(wd("{z,z")).p+'' is [2]+'')
test(ex(wd("0{1,4")).p[0] == 1)
test(ex(wd("1{1,4")).p[0] == 4)
test(ex(wd("#1,2,3")).p[0] == 3)
test(ex(wd("#<1,2,3")).p[0] == 0 )
test(ex(wd("#3")).p[0] == 0)
test(ex(wd("2#1,2,3,4")).p+'' is ''+[1,2])
test(ex(wd("4#1,2")).p+'' is ''+[1,2,1,2])
test(ex(wd("z=<1,2")).p+'' is [[1,2]]+'')
test(ex(wd("1#<z")).p+'' is ''+[1,2])
test(ex(wd("1#1,2")).p+'' is ''+[1])
test(ex(wd("~9")).p+'' is ''+[0,1,2,3,4,5,6,7,8])
test(ex(wd("~9+9")).p+'' is ''+[0..17])