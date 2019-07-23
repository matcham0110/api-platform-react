<?php

namespace App\Events;

use App\Entity\User;
use App\Entity\Customer;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface {

    /** @var Security */
    private $security;

    /**
     * Passe l'user courant à la classe
     *
     * @param Security $security
     */
    public function __construct(Security $security) 
    {
        $this->security = $security; 
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustomer(GetResponseForControllerResultEvent $event) {
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
    
        if ($customer instanceof Customer && $method === "POST") {
            $user = $this->security->getUser();
            $customer->setUser($user);
        }
    }
}