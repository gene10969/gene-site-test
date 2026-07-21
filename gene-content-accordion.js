/* Shared content accordions for FAQ and symptom detail pages. */
details.gene-content-accordion{
  padding:0 !important;
  overflow:hidden;
}

details.gene-content-accordion > summary{
  position:relative;
  display:flex;
  align-items:center;
  width:100%;
  min-height:76px;
  box-sizing:border-box;
  padding:22px 70px 22px 26px;
  color:#f4ead0;
  background:linear-gradient(180deg, rgba(217,193,126,.06), rgba(217,193,126,.018));
  cursor:pointer;
  list-style:none;
  -webkit-tap-highlight-color:transparent;
}

details.gene-content-accordion > summary::-webkit-details-marker{
  display:none;
}

details.gene-content-accordion > summary::before,
details.gene-content-accordion > summary::after{
  content:"";
  position:absolute;
  right:27px;
  top:50%;
  width:19px;
  height:1px;
  background:#d9c17e;
  transform:translateY(-50%);
  transition:opacity .25s ease, transform .25s ease;
}

details.gene-content-accordion > summary::after{
  transform:translateY(-50%) rotate(90deg);
}

details.gene-content-accordion[open] > summary::after{
  opacity:0;
  transform:translateY(-50%) rotate(0deg);
}

details.gene-content-accordion[open] > summary{
  border-bottom:1px solid rgba(217,193,126,.16);
}

details.gene-content-accordion > summary:hover{
  color:#d9c17e;
  background:linear-gradient(180deg, rgba(217,193,126,.095), rgba(217,193,126,.025));
}

details.gene-content-accordion > summary:focus-visible{
  outline:2px solid rgba(217,193,126,.9);
  outline-offset:-4px;
  border-radius:10px;
}

details.gene-content-accordion > summary h2{
  width:100%;
  margin:0 !important;
  padding:0 !important;
  color:inherit !important;
  font-size:clamp(1.05rem, 2.2vw, 1.28rem) !important;
  font-weight:500 !important;
  line-height:1.65 !important;
  letter-spacing:.035em !important;
  text-align:left !important;
  white-space:normal !important;
  text-wrap:balance;
}

details.gene-content-accordion > .gene-content-accordion__body{
  box-sizing:border-box;
  padding:24px 26px 26px;
}

details.gene-content-accordion > .gene-content-accordion__body > :first-child{
  margin-top:0 !important;
}

details.gene-content-accordion > .gene-content-accordion__body > :last-child{
  margin-bottom:0 !important;
}

details.gene-content-accordion[open] > .gene-content-accordion__body{
  animation:gene-content-accordion-reveal .32s ease-out both;
}

.gene-medical-safety-note{
  width:100%;
  box-sizing:border-box;
  padding:16px 20px;
  border:1px solid rgba(217,193,126,.28);
  border-left:2px solid rgba(217,193,126,.78);
  border-radius:12px;
  color:rgba(255,255,255,.84);
  background:rgba(217,193,126,.045);
}

.gene-medical-safety-note p{
  margin:0 !important;
  font-size:.9rem;
  line-height:1.9 !important;
  white-space:normal !important;
}

@keyframes gene-content-accordion-reveal{
  from{opacity:0; transform:translateY(-5px);}
  to{opacity:1; transform:translateY(0);}
}

@media (max-width:640px){
  details.gene-content-accordion > summary{
    min-height:68px;
    padding:18px 58px 18px 18px;
  }

  details.gene-content-accordion > summary::before,
  details.gene-content-accordion > summary::after{
    right:21px;
    width:17px;
  }

  details.gene-content-accordion > summary h2{
    font-size:clamp(.98rem, 4.35vw, 1.12rem) !important;
    line-height:1.7 !important;
    letter-spacing:.015em !important;
  }

  details.gene-content-accordion > .gene-content-accordion__body{
    padding:20px 18px 22px;
  }

  .gene-medical-safety-note{
    padding:15px 17px;
  }

  .gene-medical-safety-note p{
    font-size:.86rem;
    line-height:1.85 !important;
  }
}

@media (prefers-reduced-motion:reduce){
  details.gene-content-accordion > summary::before,
  details.gene-content-accordion > summary::after{
    transition:none;
  }

  details.gene-content-accordion[open] > .gene-content-accordion__body{
    animation:none;
  }
}
